import { Prisma } from "../../../generated/prisma/client"

export const doctorSearchableFields = ['name', 'email', 'contactNumber', 'address', 'registrationNumber', 'specialities.speciality.title', 'user.role', 'currentHospital', 'designation', 'qualification'];



export const doctorFilterableFields = ['gender', 'experience', 'averageRating', 'currentHospital', 'designation', 'qualification', 'name', 'email', 'contactNumber', 'address', 'registrationNumber', 'specialities.speciality.title', 'user.role', 'appointmentFee', 'isDeleted'];



export const doctorIncludeConfig:Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {
    user: true,
    specialities: {
        include: {
            speciality: true,
        }
    },
    appointments: {
        include: {
            patient: true,
            doctor: true,
        }
    },
    doctorSchedules: {
        include: {
            schedule: true,
        }
    },
    prescriptions: true,
    reviews: true,


}