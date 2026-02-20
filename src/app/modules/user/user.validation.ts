import z from "zod";
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
    contactNumber: z
      .string("Contact number is required")
      .min(11, "Contact number must be at least 11 digits long")
      .max(14, "Contact number must be less than 14 digits long"),
    address: z
      .string("Address is required")
      .min(10, "Address must be at least 10 characters long")
      .max(100, "Address must be less than 100 characters long")
      .optional(),
    registrationNumber: z.string("Registration number is required"),
    experience: z
      .int("Experience must be an integer")
      .nonnegative("Experience cannot be negative")
      .optional(),
    gender: z.enum(Gender, "Gender is required"),
    appointmentFee: z
      .number("Appointment fee must be a number")
      .nonnegative("Appointment fee cannot be negative")
      .optional(),
    currentHospital: z
      .string("Current hospital is required")
      .min(3, "Current hospital must be at least 3 characters long")
      .max(50, "Current hospital must be less than 50 characters long")
      .optional(),
    designation: z
      .string("Designation is required")
      .min(3, "Designation must be at least 3 characters long")
      .max(50, "Designation must be less than 50 characters long")
      .optional(),
  }),

  specialities: z
    .array(z.uuid("Speciality id must be a valid UUID"))
    .min(1, "At least one speciality is required"),
});





export { createDoctorZodSchema };