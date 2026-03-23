import { Prisma } from "../../../generated/prisma/client"
import { UserRole } from "../../../generated/prisma/enums";

export const doctorSearchableFields = ['name', 'email', 'contactNumber', 'address', 'registrationNumber', 'specialties.specialty.title', 'user.role', 'currentWorkingPlace', 'designation', 'qualification'];

export const doctorSearchableExactFields = ['user.role'];
export const doctorSearchableEnumFields: Record<string, string[]> = {
    "user.role": Object.values(UserRole),
};



export const doctorFilterableFields = ['gender', 'experience', 'averageRating', 'currentWorkingPlace', 'designation', 'qualification', 'name', 'email', 'contactNumber', 'address', 'registrationNumber', 'specialties.specialty.title', 'user.role', 'appointmentFee', 'isDeleted'];



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