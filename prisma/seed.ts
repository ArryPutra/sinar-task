import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Mulai proses seeding data...");

  await prisma.role.createMany({
    data: [
      { name: "Admin" },
      { name: "Karyawan" },
      { name: "Manajer" }
    ]
  })

  await auth.api.signUpEmail({
    body: {
      email: "admin@gmail.com",
      name: "Admin",
      password: "password123",
      roleId: 1
    }
  });

  const employee1 = await auth.api.signUpEmail({
    body: {
      email: "ahmadhadi@gmail.com",
      name: "Ahmad Hadi",
      password: "password123",
      roleId: 2
    }
  });
  const employee2 = await auth.api.signUpEmail({
    body: {
      email: "budi@gmail.com",
      name: "Budi",
      password: "password123",
      roleId: 2
    }
  });
  await prisma.employees.createMany({
    data: [
      { userId: employee1.user.id },
      { userId: employee2.user.id }
    ]
  });

  await prisma.employeeTaskCategories.createMany({
    data: [
      { name: "Kontruksi" },
      { name: "IT Konsultan" },
    ]
  });

  console.log(`✅ Seeding selesai! Berhasil`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    // Putuskan koneksi database setelah selesai
    await prisma.$disconnect();
  });