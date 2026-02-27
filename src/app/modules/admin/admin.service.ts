import { UserStatus } from "../../../generated/prisma/enums";
import prisma from "../../lib/prisma"
import { IUpdateAdminPayload } from "./admin.interface";

const getAllAdmin = async()=> {
    return await prisma.admin.findMany({
        where:{
            isDeleted: false,
        }
    });
}


const getAdminById = async(adminId: string) => {
    return await prisma.admin.findUnique({
        where: {
            id: adminId,
            isDeleted: false
        }
    })
}

const deleteAdmin = async(adminId: string) => {
    return await prisma.admin.update({
        where: {
            id: adminId,
            isDeleted: false
        },
        data: {
            isDeleted: true,
            deletedAt: new Date()
        }
    })
}
const updateAdmin = async(adminId: string, payload: IUpdateAdminPayload) => {
    const isAdminExist = await prisma.admin.findUniqueOrThrow({
        where: {
            id: adminId,
        }
    });

    return await prisma.admin.update({
        where: {
            id: adminId,
        },
        data: {
            name: payload.name ?? isAdminExist.name,
            email: payload.email ?? isAdminExist.email,
            profilePhoto: payload.profilePhoto ?? isAdminExist.profilePhoto,
            contactNumber: payload.contactNumber ?? isAdminExist.contactNumber,
            status: payload.status  ?? isAdminExist.status,
        }
    })

}

export const AdminService = {
    getAllAdmin,
    getAdminById,
    deleteAdmin,
    updateAdmin
}