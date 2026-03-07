import { UserStatus } from "../../../generated/prisma/enums";

export interface IUpdateAdminPayload{
    name?: string;
    email?: string;
    profilePhoto?: string;
    contactNumber?: string;
    status?: UserStatus;
}

export interface IAdmin {
    id: string;
    userId: string;
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    status: UserStatus;
    isDeleted: boolean;
    deletedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface IChangeUserStatusPayload {
    userId: string;
    status: UserStatus;
}

export interface IChangeUserRolePayload {
    userId: string;
    role: string;
}