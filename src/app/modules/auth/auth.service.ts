import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { User, UserStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prisma";
interface RegisterUserPayload {
name: string;
email: string;
password: string;
}
const registerPatient = async(payload: RegisterUserPayload) => {
    const {name,email, password} = payload;

    const data = await auth.api.signUpEmail({
        body: {
            name, 
            email, 
            password
        }
    })

    if(!data.user) {
       throw new AppError(status.INTERNAL_SERVER_ERROR, "Failed to register user");
    }

    
    //TODO: create patient profile after user is created

   try {
     const patient = await prisma.$transaction(async (tx)=> {
         const createdPatient = await tx.patient.create({
             data: {
                 userId: data.user.id,
                 name: data.user.name,
                 email: data.user.email,
 
             }
         })
         return createdPatient;
     })
     return {
         ...data,
         patient
     }
   } catch (error) {
    console.error("Error creating patient profile:", error);
    await prisma.user.delete({
        where: {
            id: data.user.id
        }
    })
    throw error;
   }


}

const loginUser = async(payload: {email: string, password: string}) => {
    const {email, password} = payload;
    const data = await auth.api.signInEmail({
        body: {
            email, 
            password
        }
    })

    if(!data.user) {
        throw new AppError(status.UNAUTHORIZED, "Invalid email or password");
    }
    if( data.user.status === UserStatus.SUSPENDED){
        throw new AppError(status.FORBIDDEN, "Your account is suspended. Please contact support.");
    }
    if(data.user.status === UserStatus.DELETED){
        throw new AppError(status.FORBIDDEN, "Your account is deleted. Please contact support.");
    }
    if(data.user.status === UserStatus.INACTIVE){
        throw new AppError(status.FORBIDDEN, "Your account is inactive. Please contact support.");
    }

    
    return data;

 
}


export const AuthService = {
    registerPatient,
    loginUser
}