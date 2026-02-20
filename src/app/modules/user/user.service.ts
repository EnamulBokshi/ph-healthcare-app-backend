import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { Speciality, UserRole } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
    const specialityIds: Speciality[] = [];

    for(const specilityId of payload.specialities) {
        const speciality = await prisma.speciality.findUnique({
            where: {
                id: specilityId
            }
        })
        if(!speciality) {
            throw new AppError(status.NOT_FOUND, `Speciality with id ${specilityId} not found`);

        }
        specialityIds.push(speciality);
    }

    const exDoctor = await prisma.doctor.findUnique({
        where: {
            email: payload.doctor.email
        }
    })
    
    if(exDoctor) {
        throw new AppError(status.BAD_REQUEST, "Doctor with this email already exists");
    }

    const userData = await auth.api.signUpEmail({
        body: {
            name: payload.doctor.name,
            email: payload.doctor.email,
            password: payload.password,
            role: UserRole.DOCTOR,
            needPasswordChange: true
        }
    })

    try {
        const result = await prisma.$transaction(async (tx)=> {
            const createdDoctor = await tx.doctor.create({
                data: {
                    userId: userData.user!.id,
                    ...payload.doctor
                }
            })

            const doctorSpecialityData = specialityIds.map((speciality) => {
                return {
                    doctorId: createdDoctor.id,
                    specialityId: speciality.id
                }
            })

            await tx.doctorSpeciality.createMany({
                data: doctorSpecialityData
            })

            const doctor = await tx.doctor.findUnique({
                where: {
                    id: createdDoctor.id
                },
                select: {
                    id: true,
                    userId: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    contactNumber: true,
                    address: true,
                    registrationNumber: true,
                    experience: true,
                    gender: true,
                    appointmentFee: true,
                    qualification: true,
                    currentHospital: true,
                    designation: true,
                    averageRating: true,
                    specialities: {
                        select: {
                            speciality: {
                                select: {
                                    id: true,
                                    title: true
                                }
                            }
                        }
                    },
                    user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,

                                role: true,
                                status: true,
                                emailVerified: true,
                                isDeleted: true,
                                deletedAt: true,
                                createdAt: true,
                                updatedAt: true
                            }
                    }      
                }
            })

            return doctor;
        },{
  maxWait: 5000,  // max time to wait to acquire transaction
  timeout: 10000, // max time transaction can run
})
        return result;
        
    } catch (error) {
        console.error("Error creating doctor profile:", error);
        await prisma.user.delete({
            where: {
                id: userData.user?.id
            }
        })
        throw error;
    }

}

export const UserService = {
    createDoctor
}