import { prisma } from "@/lib/prisma";

async function main() {
  console.log("🌱 Mulai proses seeding data...");

  // Membuat atau memperbarui data admin default
  const admin = await prisma.user.upsert({
    where: { email: "admin@sinarsejati.com" },
    update: {}, // Jika email sudah ada, tidak ada data yang diubah
    create: {   // Jika email belum ada, buat data baru ini
      email: "admin@sinarsejati.com",
      name: "Arry Kusuma",
    },
  });

  // Kamu bisa menambah data dummy lain di bawah ini jika diperlukan
  const userDummy = await prisma.user.upsert({
    where: { email: "budi@example.com" },
    update: {},
    create: {
      email: "budi@example.com",
      name: "Budi Santoso",
    },
  });

  console.log(`✅ Seeding selesai! Berhasil memastikan user ${admin.name} & ${userDummy.name} tersedia.`);
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