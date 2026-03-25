import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

const updateDoctorZodSchema = z.object({

  doctor: z.object({
    name: z
      .string("Name is required")
      .min(3, "Name must be at least 3 characters long")
      .max(50, "Name must be less than 50 characters long"),
    
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
    qualification: z.string("Qualification is required").optional(),
    currentWorkingPlace: z
      .string("Current working place is required")
      .min(3, "Current working place must be at least 3 characters long")
      .max(50, "Current working place must be less than 50 characters long")
      .optional(),
    designation: z
      .string("Designation is required")
      .min(3, "Designation must be at least 3 characters long")
      .max(50, "Designation must be less than 50 characters long")
      .optional(),
  }),

  specialties: z
    .array(
      z.union([
        z.uuid("Specialty id must be a valid UUID"),
        z.object({
          specialtyId: z.uuid("Specialty id must be a valid UUID"),
          shouldDelete: z.boolean().optional(),
        }),
      ]),
    )
    .min(1, "At least one specialty is required"),
}).partial()

export { updateDoctorZodSchema };