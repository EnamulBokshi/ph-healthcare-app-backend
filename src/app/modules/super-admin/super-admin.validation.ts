import z from "zod";
import { UserStatus } from "../../../generated/prisma/enums";

const updateAdminZodSchema = z.object({
    admin: z.object({
        name: z.string("Name is required")
        .min(3, "Name must be at least 3 characters long")
        .max(50, "Name must be less than 50 characters long"),
        contactNumber: z.string("Contact number is required")
        .min(11, "Contact number must be at least 11 digits long")
        .max(14, "Contact number must be less than 14 digits long"),
        address: z.string("Address is required")
        .min(10, "Address must be at least 10 characters long")
        .max(100, "Address must be less than 100 characters long"),
        profilePhoto: z.url("Profile photo must be a valid URL"),
        status: z.enum(UserStatus, "Status must be either ACTIVE, INACTIVE, or SUSPENDED"),
        
    })
}).partial();

export const AdminValidation = {
    updateAdminZodSchema
}