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