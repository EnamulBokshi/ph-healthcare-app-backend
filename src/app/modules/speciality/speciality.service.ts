import { Speciality } from "../../../generated/prisma/client";
import prisma from "../../lib/prisma";

const createSpeciality = async(payload: Speciality): Promise<Speciality> => {
    return await prisma.speciality.create({
        data: payload,
    })
}


const getAllSpecialities = async(): Promise<Speciality[]> => {
    return await prisma.speciality.findMany({
        orderBy: {
            createdAt: "desc"


        }
    });
}

const deleteSpeciality = async(id: string): Promise<Speciality> => {
    return await prisma.speciality.delete({
        where: {
            id
        }
    })
}
const updateSpeciality = async(id: string, payload: Partial<Speciality>): Promise<Speciality> => {
    return await prisma.speciality.update({
        where: {
            id
        },
        data: payload
    })
}

export const SpecialityService = {
    createSpeciality,
    getAllSpecialities,
    deleteSpeciality,
    updateSpeciality
}