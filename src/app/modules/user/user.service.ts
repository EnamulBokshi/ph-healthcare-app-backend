import status from "http-status";
import AppError from "../../../errorHelpers/AppError";
import { Prisma, Specialty, User, UserRole } from "../../../generated/prisma/client";
import { auth } from "../../lib/auth";
import prisma from "../../lib/prisma";
import { ICreateAdminPayload, ICreateDoctorPayload } from "./user.interface";
import { tokenUtils } from "../../utils/token";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { IQueryParams } from "../../../interfaces/query.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialtyIds: Specialty[] = [];

  for (const specialtyId of payload.specialties) {
    const specialty = await prisma.specialty.findUnique({
      where: {
        id: specialtyId,
      },
    });
    if (!specialty) {
      throw new AppError(
        status.NOT_FOUND,
        `Specialty with id ${specialtyId} not found`,
      );
    }
    specialtyIds.push(specialty);
  }

  const exDoctor = await prisma.doctor.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (exDoctor) {
    throw new AppError(
      status.BAD_REQUEST,
      "Doctor with this email already exists",
    );
  }

  const userData = await auth.api.signUpEmail({
    body: {
      name: payload.doctor.name,
      email: payload.doctor.email,
      password: payload.password,
      role: UserRole.DOCTOR,
      needPasswordChange: true,
    },
  });

  try {
    
    const result = await prisma.$transaction(
      async (tx) => {
        const createdDoctor = await tx.doctor.create({
          data: {
            userId: userData.user!.id,
            ...payload.doctor,
          },
        });

        const doctorSpecialtyData = specialtyIds.map((specialty) => {
          return {
            doctorId: createdDoctor.id,
            specialtyId: specialty.id,
          };
        });

        await tx.doctorSpecialty.createMany({
          data: doctorSpecialtyData,
        });

        const doctor = await tx.doctor.findUnique({
          where: {
            id: createdDoctor.id,
          },
          select: {
            id: true,
            userId: true,
            name: true,
            email: true,
            profilePhoto: true,
            contactNumber: true,
            address: true,
            registrationNumber: true,
            experience: true,
            gender: true,
            appointmentFee: true,
            qualification: true,
            currentWorkingPlace: true,
            designation: true,
            averageRating: true,
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
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,

                role: true,
                status: true,
                emailVerified: true,
                isDeleted: true,
                deletedAt: true,
                createdAt: true,
                updatedAt: true,
              },
            },
          },
        });

        return doctor;
      },
      {
        maxWait: 5000, // max time to wait to acquire transaction
        timeout: 10000, // max time transaction can run
      },
    );
    return result;
  } catch (error) {
    console.error("Error creating doctor profile:", error);
    await prisma.user.delete({
      where: {
        id: userData.user?.id,
      },
    });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to create doctor profile",
    );
  }
};

// create admin and super admin
const createAdmin = async (payload: ICreateAdminPayload) => {
  const exAdmin = await prisma.user.findUnique({
    where: {
      email: payload.body.admin.email,
    },
  });

  if (exAdmin) {
    throw new AppError(status.CONFLICT, "Admin with this email already exists");
  }
  const adminData = payload.body.admin;
  const password = payload.body.password;

  // creating user for admin
  const user = await auth.api.signUpEmail({
    body: {
      name: adminData.name,
      email: adminData.email,
      password,
      role: UserRole.ADMIN,
      needPasswordChange: true,
      rememberMe: false,
    },
  });

  if (!user.user) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to create admin user",
    );
  }

  try {
    const admin = await prisma.$transaction(async (tx) => {
      const newAdmin = await tx.admin.create({
        data: {
          userId: user.user.id,
          name: adminData.name,
          email: adminData.email,
          profilePhoto: adminData.profilePhoto,
          contactNumber: adminData.contactNumber,
        },
      });

      const createdAdmin = await tx.admin.findUnique({
        where: {
          id: newAdmin.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              status: true,
            },
          },
        },
      });
      return createdAdmin;
    });

    const accessToken = tokenUtils.getAccessToken({
      userId: user.user.id,
      email: user.user.email,
      name: user.user.name,
      role: user.user.role,
      emailVerified: user.user.emailVerified,
      isDeleted: user.user.isDeleted,
      status: user.user.status,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: user.user.id,
      email: user.user.email,
      name: user.user.name,
      role: user.user.role,
      emailVerified: user.user.emailVerified,
      isDeleted: user.user.isDeleted,
      status: user.user.status,
    });

    return {
      ...user,
      accessToken,
      refreshToken,
      admin: admin,
    };
  } catch (error: any) {
    console.error("Error creating admin profile:", error);
    // rollback -delete the user created for admin
    await prisma.user.delete({
      where: {
        id: user.user.id,
      },
    });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to create admin profile",
    );
  }
};

const createSuperAdmin = async (payload: ICreateAdminPayload) => {
  const exSuperAdmin = await prisma.user.findUnique({
    where: {
      email: payload.body.admin.email,
    },
  });

  if (exSuperAdmin) {
    throw new AppError(
      status.CONFLICT,
      "Super Admin with this email already exists",
    );
  }
  const superAdminData = payload.body.admin;
  const password = payload.body.password;

  // creating user for super admin
  const user = await auth.api.signUpEmail({
    body: {
      name: superAdminData.name,
      email: superAdminData.email,
      password,
      role: UserRole.SUPER_ADMIN,
      needPasswordChange: true,
      rememberMe: false,
    },
  });

  if (!user.user) {
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to create super admin user",
    );
  }

//   try {
//     const superAdmin = await prisma.superAdmin.create({
//       data: {
//         userId: user.user.id,
//         name: superAdminData.name,
//         email: superAdminData.email,
//         profilePhoto: superAdminData.profilePhoto,
//         contactNumber: superAdminData.contactNumber,
//       },
//     });

//     const createdSuperAdmin = await prisma.superAdmin.findUnique({
//       where: {
//         id: superAdmin.id,
//       },
//       select: {
//         id: true,
//         userId: true,
//         name: true,
//         email: true,
//         profilePhoto: true,
//         contactNumber: true,
//         isDeleted: true,
//         createdAt: true,
//         updatedAt: true,
//         user: {
//           select: {
//             id: true,
//             name: true,
//             email: true,
//             image: true,
//             role: true,
//             status: true,
//           },
//         },
//       },
//     });
//     return createdSuperAdmin;
//   } catch (error: any) {
//     console.error("Error creating super admin profile:", error);
//     // rollback -delete the user created for super admin
//     await prisma.user.delete({
//       where: {
//         id: user.user.id,
//       },
//     });
//     throw new AppError(
//       status.INTERNAL_SERVER_ERROR,
//       "Failed to create super admin profile",
//     );
//   }
try {
    const admin = await prisma.$transaction(async (tx) => {
      const newAdmin = await tx.superAdmin.create({
        data: {
          userId: user.user.id,
          name: superAdminData.name,
          email: superAdminData.email,
          profilePhoto: superAdminData.profilePhoto,
          contactNumber: superAdminData.contactNumber,
        },
      });

      const createdAdmin = await tx.superAdmin.findUnique({
        where: {
          id: newAdmin.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          contactNumber: true,
          isDeleted: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
              role: true,
              status: true,
            },
          },
        },
      });
      return createdAdmin;
    });

    const accessToken = tokenUtils.getAccessToken({
      userId: user.user.id,
      email: user.user.email,
      name: user.user.name,
      role: user.user.role,
      emailVerified: user.user.emailVerified,
      isDeleted: user.user.isDeleted,
      status: user.user.status,
    });

    const refreshToken = tokenUtils.getRefreshToken({
      userId: user.user.id,
      email: user.user.email,
      name: user.user.name,
      role: user.user.role,
      emailVerified: user.user.emailVerified,
      isDeleted: user.user.isDeleted,
      status: user.user.status,
    });

    return {
      ...user,
      accessToken,
      refreshToken,
      superAdmin: admin,
    };
  } catch (error: any) {
    console.error("Error creating admin profile:", error);
    // rollback -delete the user created for admin
    await prisma.user.delete({
      where: {
        id: user.user.id,
      },
    });
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to create admin profile",
    );
  }
};

const getAllUsers = async (query: IQueryParams)=> {
    const queryBuilder = new QueryBuilder<User, Prisma.UserWhereInput, Prisma.UserInclude>(prisma.user, query, {
        filterableFields: ['id', 'name', 'email', 'role', 'status', 'emailVerified', 'isDeleted', 'createdAt', 'updatedAt'],
        searchableFields: ['id', 'name', 'email']
     })
    const result = await queryBuilder
    .search()
    .filter()
    .paginate()
    .include({
        doctor: {
            include: {
                specialties: {
                    include: {
                        specialty: true
                    }
                }
             },
        },
        admin: true,
        superAdmin: true,
        patient: true,
      })
    .sort()
    .execute()

    return result;
}

export const UserService = {
  createDoctor,
  createAdmin,
  createSuperAdmin,
  getAllUsers,
};
