import { deleteFileCloudinary } from "../../../config/cloudinary";
import { IRequestUser } from "../../../interfaces/requestUser.interface";
import prisma from "../../lib/prisma";
import { convertDateTime } from "../schedule/schedule.utils";
import {
  IUpdatePatientHealthDataPayload,
  IUpdatePatientProfilePayload,
} from "./patient.interface";
import { convertToDateTime } from "./patient.utils";

const updateMyProfile = async (
  user: IRequestUser,
  payload: IUpdatePatientProfilePayload,
) => {
  const { userId } = user;
  const patient = await prisma.patient.findUniqueOrThrow({
    where: {
      userId,
    },
    include: {
      patientHealthData: true,
      medicalReports: true,
    },
  });

  await prisma.$transaction(async (tx) => {
    if (payload.patientInfo) {
      await tx.patient.update({
        where: {
          id: patient.id,
        },
        data: payload.patientInfo,
      });

      if (payload.patientInfo.name || payload.patientInfo.profilePhoto) {
        const userData = {
          name: payload.patientInfo.name
            ? payload.patientInfo.name
            : patient.name,
          image: payload.patientInfo.profilePhoto
            ? payload.patientInfo.profilePhoto
            : patient.profilePhoto,
        };
        await tx.user.update({
          where: {
            id: patient.userId,
          },
          data: userData,
        });
      }
    }
    if (payload.patientHealthData) {
      const healthData: IUpdatePatientHealthDataPayload =
        payload.patientHealthData;

      if (payload.patientHealthData.dateOfBirth) {
        healthData.dateOfBirth = convertToDateTime(
          typeof healthData.dateOfBirth === "string"
            ? healthData.dateOfBirth
            : undefined,
        ) as Date;
      }

      await tx.patientHealthData.upsert({
        where: {
          patientId: patient.id,
        },
        update: healthData,
        create: {
          ...healthData,
          patientId: patient.id,
        },
      });
    }

    if (
      payload.medicalReports &&
      payload.medicalReports.length > 0 &&
      Array.isArray(payload.medicalReports)
    ) {
      for (const report of payload.medicalReports) {
        if (report.shouldDelete && report.reportId) {
         const result = await tx.medicalReport.delete({
            where: {
              id: report.reportId,
            },
          });
          await deleteFileCloudinary(result.reportLink);
        } else if (report.reportName && report.reportLink) {
          await tx.medicalReport.create({
            data: {
              reportName: report.reportName,
              reportLink: report.reportLink,
              patientId: patient.id,
            },
          });
        }
      }
    }
  });

  const result = await prisma.patient.findUnique({
    where: {
      userId,
    },
    include: {
      user: true,
      patientHealthData: true,
      medicalReports: true,
    },
  });

  return result;
};

export const PatientService = {
  updateMyProfile,
};
