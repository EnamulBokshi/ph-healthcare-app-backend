import { Prisma } from "../../../generated/prisma/client"

export const doctorSearchableFields = ['name', 'email', 'contactNumber', 'address', 'registrationNumber', 'specialities.specialty.title', 'user.role', 'currentHospital', 'designation', 'qualification'];



export const doctorFilterableFields = ['gender', 'experience', 'averageRating', 'currentHospital', 'designation', 'qualification', 'name', 'email', 'contactNumber', 'address', 'registrationNumber', 'specialities.specialty.title', 'user.role', 'appointmentFee', 'isDeleted'];



export const doctorIncludeConfig:Partial<Record<keyof Prisma.DoctorInclude, Prisma.DoctorInclude[keyof Prisma.DoctorInclude]>> = {
    user: true,
    specialties: {
        include: {
            specialty: true,
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