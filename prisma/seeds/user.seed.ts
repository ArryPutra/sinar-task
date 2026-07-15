import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function userSeed() {
  await prisma.userRole.createMany({
    data: [
      { name: "Admin" },
      { name: "Employee" }
    ]
  })

  const admin1 = await auth.api.createUser({
    body: {
      email: "sinartask@gmail.com",
      name: "John Doe",
      password: "password123",
      role: "admin",
      data: {
        userRoleId: 1
      }
    }
  });
  await prisma.admin.createMany({
    data: [
      { userId: admin1.user.id },
    ]
  });

  const employee1 = await auth.api.createUser({
    body: {
      email: "arrykusumaputra04@gmail.com",
      name: "Arry Kusuma Putra",
      password: "password123",
    }
  });
  const employee2 = await auth.api.createUser({
    body: {
      email: "ahmadhadi@gmail.com",
      name: "Ahmad Hadi",
      password: "password123",
    }
  });
  await prisma.employee.createMany({
    data: [
      { userId: employee1.user.id, phoneNumber: "081350445065" },
      { userId: employee2.user.id, phoneNumber: "081234567892" }
    ]
  });
}