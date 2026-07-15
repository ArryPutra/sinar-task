// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from 'better-auth/plugins';
import { prisma } from "./prisma";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      disableSignUp: true
    },
  },
  account: {
    accountLinking: {
      trustedProviders: ["google"],
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      userRoleId: {
        type: "number",
        required: true,
      }
    }
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              // memastikan bahwa email sudah terverifikasi (agar google login dapat dilakukan)
              emailVerified: true,
            },
          };
        },
      },
    },
  },
  plugins: [
    nextCookies(),
    admin(),
  ]
});