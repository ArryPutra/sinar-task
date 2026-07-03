import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function userSeed() {
  await prisma.userRole.createMany({
    data: [
      { name: "Admin" },
      { name: "Karyawan" },
      { name: "Manajer" }
    ]
  })

  await auth.api.createUser({
    body: {
      email: "admin@gmail.com",
      name: "Admin",
      password: "password123",
      role: "admin",
      data: {
        userRoleId: 1
      }
    }
  });

  const employee1 = await auth.api.createUser({
    body: {
      email: "ahmadhadi@gmail.com",
      name: "Ahmad Hadi",
      password: "password123",
    }
  });
  const employee2 = await auth.api.createUser({
    body: {
      email: "budi@gmail.com",
      name: "Budi",
      password: "password123",
    }
  });
  await prisma.employee.createMany({
    data: [
      { userId: employee1.user.id, phoneNumber: "081234567890" },
      { userId: employee2.user.id, phoneNumber: "081234567891" }
    ]
  });
}