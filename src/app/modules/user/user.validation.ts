import z, { xid } from "zod";
import { Gender } from "../../../generated/prisma/enums";

const createDoctorZodSchema = z.object({
  password: z
    .string("Password is required")
    .min(6, "Password must be at least 6 characters long")
    .max(20, "Password must be less than 20 characters long"),
  doctor: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be less than 50 characters long"),
    email: z.email("Enter a valid email address"),
    profilePhoto: z.url("Profile photo must be a valid URL").optional(),

    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 digits long")
      .max(14, "Contact number must be less than 14 digits long").optional(),
    address: z
      .string("Address is required")
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must be less than 100 characters long")
      .optional(),
    registrationNumber: z.string("Registration number is required"),
    experience: z
      .int("Experience must be an integer")
      .nonnegative("Experience cannot be negative"),
      
    gender: z.enum(Gender, "Gender is required"),
    appointmentFee: z
      .number("Appointment fee must be a number")
      .nonnegative("Appointment fee cannot be negative")
      ,
    currentWorkingPlace: z
      .string("Current working place is required")
      .min(3, "Current working place must be at least 3 characters long")
      .max(50, "Current working place must be less than 50 characters long")
      ,
    designation: z
      .string("Designation is required")
      .min(3, "Designation must be at least 3 characters long")
      .max(50, "Designation must be less than 50 characters long"),
    qualification: z.string("Qualification is required")
  }),

  specialities: z
    .array(z.uuid("Specialty id must be a valid UUID"))
    .min(1, "At least one specialty is required"),
});




const createAdminZodSchema = z.object({
  body: z.object({
    password:z.string().min(6, "Password must be at least 6 characters long"),
    admin: z.object({
      name:z.string().min(3, "Name must be at least 3 characters long").max(50, "Name must be less than 50 characters long"),
      email: z.email("Enter a valid email address"),
      profilePhoto: z.url("Invalid email format"),
      contactNumber: z.string().min(11, "Contact number must be at least 11 digits long").max(14, "Contact number must be less than 14 digits long"),
    })
  })
})

export const UserValidation = {
  createDoctorZodSchema,
  createAdminZodSchema
}