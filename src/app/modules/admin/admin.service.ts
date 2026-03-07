import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { UserStatus } from "../../../generated/prisma/enums";
import prisma from "../../lib/prisma"
import { IChangeUserRolePayload, IChangeUserStatusPayload, IUpdateAdminPayload } from "./admin.interface";
import { IRequestUser } from "../../../interfaces/requestUser.interface";

const getAllAdmin = async()=> {
    return await prisma.admin.findMany({
        where:{
            isDeleted: false,
        },
        include: {
            user: true,
        }
    });
}


const getAdminById = async(adminId: string) => {
    return await prisma.admin.findUnique({
        where: {
            id: adminId,
            isDeleted: false
        },
        include: {
            user: true,
        }
    })
}

const deleteAdmin = async(adminId: string,user:IRequestUser) => {

 
    const isAdminExist = await prisma.admin.findUnique({
        where: {
            id: adminId,
            isDeleted: false
        }
    });
    
    if(!isAdminExist) {
        throw new AppError(status.NOT_FOUND,"Admin not found");
    }
   // Validate self delete
    if(user.role === "ADMIN" && user.userId === isAdminExist.userId){
        throw new AppError(status.BAD_REQUEST,"Admin cannot delete self");
    }
    const result =  await prisma.$transaction(async(tx)=> {
        await tx.admin.update({
            where: {
                id: adminId,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });
        await tx.user.update({
            where: {
                id: isAdminExist.userId,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date(),
                status: UserStatus.DELETED
            }
        });
        await tx.session.deleteMany({
            where: {
                userId: isAdminExist.userId,
            },
        });

        await tx.account.deleteMany({
            where: {
                userId: isAdminExist.userId,
            },
        });
        const admin = await getAdminById(adminId);
        return admin;

     });

        return result;

    
}
const updateAdmin = async(adminId: string, payload: IUpdateAdminPayload) => {
    const isAdminExist = await prisma.admin.findUnique({
        where: {
            id: adminId,
            isDeleted: false
        }
    });
    if(!isAdminExist) {
        throw new AppError(status.NOT_FOUND,"Admin not found");
    }

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

const changeUserStatus = async(user: IRequestUser, payload: IChangeUserStatusPayload)=>{
    // checks:
    //1. Super admin can change other admins and super admins status but not self status
    //2. Admin can change only other admin status but not self status and cannot change super admin status

    if(user.role === "SUPER_ADMIN" && user.userId === payload.userId){
        throw new AppError(status.BAD_REQUEST,"Super admin cannot change own status");
    }
    if(user.role === "ADMIN" && (user.userId === payload.userId || payload.status === UserStatus.ACTIVE)){
        throw new AppError(status.BAD_REQUEST,"Admin cannot change own status or activate user");
    }

    const targetUser = await prisma.user.findUnique({
        where: {
            id: payload.userId,
            isDeleted: false
        }
    });

    if(!targetUser) {
        throw new AppError(status.NOT_FOUND,"User not found");
    }

    return await prisma.user.update({
        where: {
            id: payload.userId,
        },
        data: {
            status: payload.status,
        }
    });

   

}


const changeUserRole = async(user: IRequestUser, payload: IChangeUserRolePayload) => {

}



export const AdminService = {
    getAllAdmin,
    getAdminById,
    deleteAdmin,
    updateAdmin,
    changeUserStatus,
    changeUserRole
}