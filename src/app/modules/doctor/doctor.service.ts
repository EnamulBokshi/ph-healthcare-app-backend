import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import prisma from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";

const getAllDoctors = async () => {
  const doctors = await prisma.doctor.findMany({
    where: {
      isDeleted: false,
    },
    include: {
      user: true,
      specialities: {
        select: {
          speciality: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });
  return doctors;
};

const updateDoctor = async (
  doctorId: string,
  payload: IUpdateDoctorPayload,
) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  const { doctor: doctorData, specialities } = payload;

  await prisma.$transaction(async (tx) => {
    if (doctorData) {
      await tx.doctor.update({
        where: {
          id: doctorId,
        },
        data: {
          ...doctorData,
        },
      });
    }
    if (specialities && specialities.length > 0) {
      for (const speciality of specialities) {
        const { specialityId, shouldDelete } = speciality;
        if (shouldDelete) {
          await tx.doctorSpeciality.delete({
            where: {
              doctorId_specialityId: {
                doctorId,
                specialityId,
              },
            },
          });
        } else {
          await tx.doctorSpeciality.upsert({
            where: {
              doctorId_specialityId: {
                doctorId,
                specialityId,
              },
            },
            update: {},
            create: {
              doctorId,
              specialityId,
            },
          });
        }
      }
    }
  });

  const doctor = await getDoctorById(doctorId);

  return doctor;
};

const deleteDoctor = async (doctorId: string) => {
  const isDoctorExist = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
      isDeleted: false,
    },
  });

  if (!isDoctorExist) {
    throw new AppError(status.NOT_FOUND, "Doctor not found");
  }

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: {
        id: doctorId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
      },
    });
    await tx.user.update({
      where: {
        id: isDoctorExist.userId,
      },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        status: UserStatus.DELETED,
      },
    });

    await tx.session.deleteMany({
      where: {
        userId: isDoctorExist.userId,
      },
    });

    await tx.doctorSpeciality.deleteMany({
      where: {
        doctorId: doctorId,
      },
    });
  });
  return {message: "Doctor deleted successfully"};
};

const getDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
    include: {
      user: true,
      specialities: {
        select: {
          speciality: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      },
    },
  });
  return doctor;
};
export const DoctorService = {
  getAllDoctors,
  updateDoctor,
  deleteDoctor,
  getDoctorById,
};
