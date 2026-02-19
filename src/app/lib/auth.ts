import { PrismaClient } from "@prisma/client/extension";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
// If your Prisma file is located elsewhere, you can change the path

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  user: {
    additionalFields: {
        role: {
            type: "string",
            required: true,
            defaultValue: "PATIENT",
        },
        status: {
            type: "string",
            required: true,
            defaultValue: "ACTIVE",
        },
        needPasswordChange: {
          type: "boolean",
          required: true,
          defaultValue: false,
        },
        isDeleted: {
          type: "boolean",
          required: true,
          defaultValue: false,
        },
        deletedAt: {
          type: "date",
          required: false,
          defaultValue: null,
        }


    }
  },

  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:5000"],
  advanced: {
    disableCSRFCheck: true, // Disable CSRF check for development purposes. Make sure to enable it in production!
  }
});
