import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { PaymentStatus, UserRole } from "../../../generated/prisma/enums";
import { IRequestUser } from "../../../interfaces/requestUser.interface";
import prisma from "../../lib/prisma";

const getDashboardStats = async(user: IRequestUser)=>{
 let statsData;

 switch(user.role){
    case UserRole.SUPER_ADMIN: 
        statsData = getSuperAdminStatsData();

        break;

    case UserRole.ADMIN:
        statsData = getAdminStatsData();
        break;


    case UserRole.DOCTOR:
            statsData = getDoctorStatsData(user);
        break;

    case UserRole.PATIENT:
        statsData = getPatientStatsData(user);
        break;

    default:
        throw new AppError(status.BAD_REQUEST, "Invalid user role");

 }

    return statsData;

}


const getSuperAdminStatsData = async() => {
    const appointmentCount = await prisma.appointment.count();
    const paymentCount = await prisma.payment.count();
    const doctorCount = await prisma.doctor.count();
    const patientCount = await prisma.patient.count();
    const userCount = await prisma.user.count();
    const adminCount = await prisma.admin.count();
    const superAdminCount = await prisma.superAdmin.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: "PAID"
        }
    })

    const barChatData = await getBarChartData();
    const pieChartData = await getPieChartData();

    return {
        appointmentCount,
        paymentCount,
        doctorCount,
        patientCount,
        userCount,
        adminCount,
        superAdminCount,
        totalRevenue: totalRevenue._sum.amount || 0,
        
        barChatData: barChatData.appointmentCountByMonth,
        revenueByMonth: barChatData.revenueByMonth,
        pieChartData
    }


}

const getAdminStatsData = async() => {
    const appointmentCount = await prisma.appointment.count();
    const paymentCount = await prisma.payment.count();
    const doctorCount = await prisma.doctor.count();
    const patientCount = await prisma.patient.count();
    const userCount = await prisma.user.count();
    const adminCount = await prisma.admin.count();

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    })

    const barChatData = await getBarChartData();
    const pieChartData = await getPieChartData();
    return {
        appointmentCount,
        paymentCount,
        doctorCount,
        patientCount,
        userCount,
        adminCount,
        totalRevenue: totalRevenue._sum.amount || 0,
        barChatData: barChatData.appointmentCountByMonth,
        revenueByMonth: barChatData.revenueByMonth,
        pieChartData
    }

}


const getDoctorStatsData = async(user:IRequestUser) => {
    const doctorData = await prisma.doctor.findUniqueOrThrow({
        where: {
            email: user.email
        },
        include: {
            appointments: true,
            reviews: true,
            user: true,
        }
    })


    const reviewCount = doctorData.reviews.length;
    const appointmentCount = doctorData.appointments.length;
    const averageRating = reviewCount > 0 ? doctorData.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount : 0;

    const patientCount = await prisma.appointment.groupBy({
        by: ["patientId"],
        _count: {
            id: true
        },
        where: {
            doctorId: doctorData.id
        }
    });

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID,
            appointment: {
                doctorId: doctorData.id
            }
        }
    });


    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: {
            id: true
        },
        where: {
            doctorId: doctorData.id
        }
    });


    const formattedAppointmentStatusDistribution =  appointmentStatusDistribution.map(({_count, status}) => {
        return {
            status,
            count: _count.id
        }
    });

    return {
        reviewCount,
        appointmentCount,
        averageRating,
        patientCount: patientCount.length,
        totalRevenue: totalRevenue._sum.amount || 0,
        
        appointmentStatusDistribution: formattedAppointmentStatusDistribution
    }

}


const getPatientStatsData = async(user:IRequestUser) => {
    const patientData = await prisma.patient.findUniqueOrThrow({
        where: {
            email: user.email
        }
    });

    const appointmentCount = await prisma.appointment.count({
        where: {
            patientId: patientData.id
        }
    });

    const totalAmountSpent = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                patientId: patientData.id
            },
            status: PaymentStatus.PAID
         }
    });

    const reviewCount = await prisma.review.count({
        where: {
            patientId: patientData.id
        },
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: {
            id: true
        },
        where: {
            patientId: patientData.id
        }
    });
    
    const formattedAppointmentStatusDistribution =  appointmentStatusDistribution.map(({_count, status}) => {
        return {
            status,
            count: _count.id
        }
    });

    return {
        appointmentCount,
        totalAmountSpent: totalAmountSpent._sum.amount || 0,
        reviewCount,
        appointmentStatusDistribution: formattedAppointmentStatusDistribution
    }

}


const getPieChartData =async()=> {
    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ["status"],
        _count: {
            id: true
        }
    });
    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({_count, status}) =>  {
        return {
            status,
            count: _count.id
        }
    });

    return formattedAppointmentStatusDistribution;

}

const getBarChartData = async() => {


    interface AppointmentCountByMonth {
        month: Date;
        count: bigint;
    }

    const appointmentCountByMonth: AppointmentCountByMonth[] = await prisma.$queryRaw`

    SELECT DATE_TRUNC('month', "createdAt")  AS month, 
    CAST(COUNT(*) AS INTEGER) AS count
    FROM "appointments"
    GROUP BY month
    ORDER BY month ASC;    
    `


    const revenueByMonth = await prisma.payment.groupBy({
        by: ["createdAt"],
        _sum: {
            amount: true
        },
        where: {
            status: PaymentStatus.PAID
        }
    });

    const formattedRevenueByMonth = revenueByMonth.map(({_sum, createdAt}) => {
        const month = createdAt.getMonth() + 1; // getMonth is zero-based
        const year = createdAt.getFullYear();
        return {
            month: `${year}-${month.toString().padStart(2, "0")}`,
            revenue: _sum.amount || 0
        }
    });


    return {
        appointmentCountByMonth,
        revenueByMonth: formattedRevenueByMonth
    };
}



export const StatsService = {
    getDashboardStats
}