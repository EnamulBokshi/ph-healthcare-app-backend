import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import prisma from "../../lib/prisma";
import { IUpdateDoctorPayload } from "./doctor.interface";
import { UserStatus } from "../../../generated/prisma/enums";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../../interfaces/query.interface";
import {
  doctorFilterableFields,
  doctorIncludeConfig,
  doctorSearchableFields,
} from "./doctor.constant";
import { Doctor, Prisma } from "../../../generated/prisma/client";
import { includes } from "zod";

const getAllDoctors = async (query: IQueryParams) => {

  const queryBuilder = new QueryBuilder<
    Doctor,
    Prisma.DoctorWhereInput,
    Prisma.DoctorInclude
  >(prisma.doctor, query, {
    searchableFields: doctorSearchableFields,
    filterableFields: doctorFilterableFields,
  });

  const result = await queryBuilder
  .search()
  .filter()
  .where({ isDeleted: false })
  .include({
    user: true,
    specialties: {
      include: {
        specialty: true,
      },
    },
  })
  .dynamicInclude({
    doctorIncludeConfig,
  })
  .paginate()
  
  .sort()
  .execute()

  return result;
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
      for (const specialty of specialities) {
        const { specialtyId, shouldDelete } = specialty;
        if (shouldDelete) {
          await tx.doctorSpecialty.delete({
            where: {
              doctorId_specialtyId: {
                doctorId,
                specialtyId,
              },
            },
          });
        } else {
          await tx.doctorSpecialty.upsert({
            where: {
              doctorId_specialtyId: {
                doctorId,
                specialtyId,
              },
            },
            update: {},
            create: {
              doctorId,
              specialtyId,
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

    await tx.doctorSpecialty.deleteMany({
      where: {
        doctorId: doctorId,
      },
    });
  });
  return { message: "Doctor deleted successfully" };
};

const getDoctorById = async (doctorId: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: {
      id: doctorId,
    },
    include: {
      user: true,
      specialties: {
        select: {
          specialty: {
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
