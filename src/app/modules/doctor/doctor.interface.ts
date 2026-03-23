import { Gender } from "../../../generated/prisma/enums";

// export interface IUpdateDoctorPayload {
//   name?: string;
//   email?: string;
//   profilePhoto?: string;
//   contactNumber?: string;
//   address?: string;
//   registrationNumber?: string;
//   experience?: number;
//   gender?: Gender;
//   appointmentFee?: number;
//   qualification?: string;
//   currentHospital?: string;
//   designation?: string;
// }


export interface IUpdateDoctorSpecialtyPayload {
    specialtyId: string;
    shouldDelete?: boolean; 
}


export interface IUpdateDoctorPayload {
  doctor?: {
    name?: string;
    email?: string;
    profilePhoto?: string;
    contactNumber?: string;
    address?: string;
    registrationNumber?: string;
    experience?: number;
    gender?: Gender;
    appointmentFee?: number;
    qualification?: string;
    currentHospital?: string;
    designation?: string;
  };
  specialties?: IUpdateDoctorSpecialtyPayload[]; // Array of specialty titles
}
