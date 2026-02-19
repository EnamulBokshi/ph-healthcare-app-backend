import { User, UserStatus } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
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
        throw new Error("Failed to register user");
    }

    
    //TODO: create patient profile after user is created
    return data


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
        throw new Error("Invalid email or password");
    }
    if( data.user.status === UserStatus.SUSPENDED){
        throw new Error("Your account is suspended. Please contact support.");
    }
    if(data.user.status === UserStatus.DELETED){
        throw new Error("Your account is deleted. Please contact support.");
    }
    if(data.user.status === UserStatus.INACTIVE){
        throw new Error("Your account is inactive. Please contact support.");
    }
    
    return data;

 
}


export const AuthService = {
    registerPatient,
    loginUser
}