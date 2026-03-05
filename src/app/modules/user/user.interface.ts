/*
model Doctor{
    id String @id @default(uuid(7))
    name String
    email String @unique
    profilePhoto String?
    contactNumber String?
    address String?
    isDeleted Boolean @default(false)
    deletedAt DateTime?

    registrationNumber String @unique
    experience Int @default(0)
    gender Gender
    appointmentFee Float @default(0.0)
    qualification String?
    currentHospital String?
    designation String?
    averageRating Float @default(0.0)


    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt



    userId String @unique
    user User @relation(fields: [userId], references: [id], onDelete: Cascade, onUpdate: Cascade)

    specialities DoctorSpecialty[]
    @@index([email], name:"idx_doctor_email")
    @@index([isDeleted], name:"idx_doctor_isDeleted")
    @@map("doctors")
}
*/

import { Gender } from "../../../generated/prisma/enums";

export interface ICreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber: string;
    experience?: number;
    gender: Gender;
    appointmentFee?: number;
    qualification?: string;
    currentHospital?: string;
    designation?: string;
  };

  specialities: string[]; // Array of specialty titles
}

export interface ICreateAdminPayload {
  body: {
    password: string;
    admin: {
      name: string;
      email: string;
      profilePhoto?: string;
      contactNumber?: string;
    };
  };
}
