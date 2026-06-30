// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin } from 'better-auth/plugins';
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true
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
  plugins: [
    nextCookies(),
    admin(),
  ]
});