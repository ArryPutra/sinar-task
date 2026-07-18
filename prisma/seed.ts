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
      {
        name: "Belum Dikerjakan",
        colorHex: "#94A3B8" // Abu-abu (Karyawan belum menyentuh tugas/laporan sama sekali)
      },
      {
        name: "Sedang Dikerjakan",
        colorHex: "#3B82F6" // Biru (Karyawan sudah mulai mencicil laporan/upload dokumen)
      },
      {
        name: "Selesai Semuanya",
        colorHex: "#10B981" // Hijau (Admin sudah ketok palu bahwa tugas ini sah & rampung)
      },
    ]
  })

  await prisma.employeeTaskCategory.createMany({
    data: [
      { name: "Kontraktor" },
      { name: "IT Konsultan" },
      { name: "Software Developer" },
      { name: "Pengadaan Barang & Jasa" },
    ]
  });

  await prisma.employeeTaskDocumentCategory.createMany({
    data: [
      { name: "Laporan Harian dan Daftar Hadir", slug: "laporan-harian-dan-daftar-hadir", },
      { name: "Checklist Peralatan Kerja", slug: "checklist-peralatan-kerja", },
      { name: "Dokumentasi Safety Talk", slug: "dokumentasi-safety-talk", },
      { name: "Daily Checkup", slug: "daily-checkup", },
      { name: "Laporan Progress Pekerjaan", slug: "laporan-progress-pekerjaan", },
      { name: "Pengamatan Safety Closed", slug: "pengamatan-safety-closed", },
      { name: "Dokumen Lainnya", slug: "dokumen-lainnya", isRequired: false, },
    ]
  });

  await prisma.employeeTaskReportStatus.createMany({
    data: [
      {
        name: "Draft",
        colorHex: "#6B7280",
        icon: "FilePenLine",
      }, // Laporan masih disimpan sebagai draf dan belum dikirim.

      {
        name: "Menunggu Peninjauan",
        colorHex: "#F59E0B",
        icon: "Clock3",
      }, // Laporan telah dikirim dan sedang menunggu diperiksa oleh atasan.

      {
        name: "Perlu Revisi",
        colorHex: "#F97316",
        icon: "RotateCcw",
      }, // Laporan perlu diperbaiki sesuai catatan dari peninjau.

      {
        name: "Disetujui",
        colorHex: "#22C55E",
        icon: "CircleCheckBig",
      }, // Laporan telah diperiksa dan diterima.

      {
        name: "Ditolak",
        colorHex: "#EF4444",
        icon: "CircleX",
      }, // Laporan ditolak dan tidak dapat diterima.
    ],
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