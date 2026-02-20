import { Doctor } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma"

const getAllDoctors = async ()=> {
    const doctors = await prisma.doctor.findMany({
        include: {
            user: true,
            specialities: {
                select: {
                    speciality: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            }       
        }
    })
    return doctors;
}

const updateDoctor = async(doctorId: string, payload: Partial<Doctor>, specialities?: string[]) : Promise<Doctor> => {
    return await prisma.doctor.update({
        where: {
            id: doctorId

        },
        data: payload
    })
}

const deleteDoctor = async(doctorId: string) => {
    await prisma.doctor.update({
        where: {
            id: doctorId
        },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    })
}

const getDoctorById = async(doctorId: string) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            id: doctorId
        },
        include: {
            user: true,
            specialities: {
                select: {
                    speciality: {
                        select: {
                            id: true,
                            title: true
                        }
                    }
                }
            }
        }
    })
    return doctor;  
}
export const DoctorService = {
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
    getDoctorById
}