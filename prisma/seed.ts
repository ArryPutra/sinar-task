import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Mulai proses seeding data...");

  await prisma.role.createMany({
    data: [
      { name: "Admin" },
      { name: "Pegawai" },
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
  await auth.api.signUpEmail({
    body: {
      email: "employee@gmail.com",
      name: "Employee",
      password: "password123",
      roleId: 2
    }
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