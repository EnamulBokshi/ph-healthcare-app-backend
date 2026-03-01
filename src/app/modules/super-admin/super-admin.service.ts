import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { UserRole, UserStatus } from "../../../generated/prisma/enums";
import prisma from "../../lib/prisma"
import { IUpdateAdminPayload } from "./super-admin.interface";
import { IRequestUser } from "../../../interfaces/requestUser.interface";

const getAllSuperAdmin = async()=> {
    return await prisma.superAdmin.findMany({
        where:{
            isDeleted: false,
        },
        include: {
            user: true,
        }
    });
}


const getSuperAdminById = async(superAdminId: string) => {
    return await prisma.superAdmin.findUnique({
        where: {
            id: superAdminId,
            isDeleted: false,
        },
        include: {
            user: true,
        }
    })
}

const deleteSuperAdmin = async(superAdminId: string, user: IRequestUser) => {

    

    const isSuperAdminExist = await prisma.superAdmin.findUnique({
        where: {
            id: superAdminId,
            isDeleted: false
        }
    });
    
    if(!isSuperAdminExist) {
        throw new AppError(status.NOT_FOUND,"Super Admin not found");
    }

    // Validate self delete
    if(user.role === UserRole.SUPER_ADMIN && user.userId === isSuperAdminExist.userId){
        throw new AppError(status.BAD_REQUEST,"Super Admin cannot delete self");
    }

    await prisma.$transaction(async(tx)=>{
        await tx.superAdmin.update({
            where: {
                id: superAdminId,
                isDeleted:false,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });
        await tx.user.update({
            where: {
                id: isSuperAdminExist.userId,
            },
            data: {
                isDeleted: true,
                deletedAt: new Date()
            }
        });

        await tx.session.deleteMany({
            where: {
                userId: isSuperAdminExist.userId,
            },
        });
        
        await tx.account.deleteMany({
            where: {
                userId: isSuperAdminExist.userId,
            },
        });
    })

    return {message: "Super Admin deleted successfully"};
    
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