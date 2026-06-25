// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma"; // Mengarah ke file instance prisma kamu kemarin

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true
  },
  user: {
    additionalFields: {
      roleId: {
        type: "number",
        required: true,
      }
    }
  },
  plugins: [nextCookies()]
});