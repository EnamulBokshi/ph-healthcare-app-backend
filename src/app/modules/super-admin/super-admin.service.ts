import { UserStatus } from "../../../generated/prisma/enums";
import prisma from "../../lib/prisma"
import { IUpdateAdminPayload } from "./super-admin.interface";

const getAllSuperAdmin = async()=> {
    return await prisma.superAdmin.findMany({
        where:{
            isDeleted: false,
        }
    });
}


const getSuperAdminById = async(superAdminId: string) => {
    return await prisma.superAdmin.findUnique({
        where: {
            id: superAdminId,
            isDeleted: false,
        }
    })
}

const deleteSuperAdmin = async(superAdminId: string) => {
    return await prisma.superAdmin.update({
        where: {
            id: superAdminId,
            isDeleted: false
        },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    })
}
const updateSuperAdmin = async(superAdminId: string, payload: IUpdateAdminPayload) => {
    const isSuperAdminExist = await prisma.superAdmin.findUniqueOrThrow({
        where: {
            id: superAdminId,
            isDeleted: false
        }
    });

    return await prisma.superAdmin.update({
        where: {
            id: superAdminId,
            isDeleted: false
        },
        data: {
            name: payload.name ?? isSuperAdminExist.name,
            email: payload.email ?? isSuperAdminExist.email,
            profilePhoto: payload.profilePhoto ?? isSuperAdminExist.profilePhoto,
            contactNumber: payload.contactNumber ?? isSuperAdminExist.contactNumber,
            status: payload.status  ?? isSuperAdminExist.status,
        }
    })

}

export const SuperAdminService = {
    getAllSuperAdmin,
    getSuperAdminById,
    deleteSuperAdmin,
    updateSuperAdmin
}