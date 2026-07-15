import { prisma } from "@/lib/prisma";
import userSeed from "./seeds/user.seed";

async function main() {
  console.log("🌱 Mulai proses seeding data...");

  await userSeed();

  await prisma.employeeTaskStatus.createMany({
    data: [
      { name: "Belum Dimulai", colorHex: "#6C757D", },
      { name: "Sedang Berlangsung", colorHex: "#0D6EFD", },
      { name: "Ditutup", colorHex: "#DC3545", },
    ]
  });

  await prisma.employeeTaskAssignmentStatus.createMany({
    data: [
      { name: "Ditugaskan", colorHex: "#3B82F6", },
      { name: "Menunggu Review", colorHex: "#A855F7", },
      { name: "Revisi", colorHex: "#F59E0B", },
      { name: "Selesai", colorHex: "#10B981", }
    ]
  });

  await prisma.employeeTaskCategory.createMany({
    data: [
      { name: "Kontraktor" },
      { name: "IT Konsultan" },
      { name: "Software Developer" },
      { name: "Pengadaan Barang & Jasa" },
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