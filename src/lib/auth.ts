// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma"; // Mengarah ke file instance prisma kamu kemarin
import { authClient } from "./auth-client";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true, // Mengaktifkan login pakai email & password standar
  },
});