import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import userSeed from "./seeds/user.seed";

async function main() {
  console.log("🌱 Mulai proses seeding data...");

  await userSeed();

  await prisma.employeeTaskCategory.createMany({
    data: [
      { name: "Kontruksi" },
      { name: "IT Konsultan" },
    ]
  });

  await prisma.employeeTaskAssignmentStatus.createMany({
    data: [
      { name: "Belum Dimulai", colorHex: "#64748b", },
      { name: "Sedang Dikerjakan", colorHex: "#3b82f6", },
      { name: "Menunggu Review", colorHex: "#a855f7", },
      { name: "Revisi", colorHex: "#f59e0b", },
      { name: "Selesai", colorHex: "#10b981", }
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