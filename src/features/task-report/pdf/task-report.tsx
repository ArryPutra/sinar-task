"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatDateTimeString } from "@/utils/date";
import { PrinterIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface TaskReportPdfProps {
  judulPekerjaan: string;
  waktuLaporan: Date;
  lokasiPekerjaan: string;
  namaPelapor: string;
  picPekerjaan: string;
  taskReportStatusId: number;
  daftarDokumen: {
    name: string;
    employeeTaskDocument: {
      fileUrls: string[]
    }[];
  }[]
}

export default function TaskReportPdf({
  judulPekerjaan,
  waktuLaporan,
  lokasiPekerjaan,
  namaPelapor,
  picPekerjaan,
  taskReportStatusId,
  daftarDokumen
}: TaskReportPdfProps) {
  const [mount, setMount] = useState(false);
  const [isReadyToPrint, setIsReadyToPrint] = useState(false);

  useEffect(() => {
    setMount(true);

    // 1. Kumpulkan SEMUA URL gambar dengan aman
    const imageUrls = [
      "/images/fakfak-logo.png",
      "/images/logo.png"
    ];

    daftarDokumen.forEach((dokumen) => {
      dokumen.employeeTaskDocument.forEach((dok) => {
        if (dok.fileUrls && dok.fileUrls.length > 0) {
          // Masukkan semua URL gambar di dalam array
          imageUrls.push(...dok.fileUrls);
        }
      });
    });

    // 2. Preload semua gambar agar siap sebelum window.print()
    Promise.all(
      imageUrls.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = resolve; // Tetap jalan meskipun 1 gambar gagal load
        });
      })
    ).then(() => {
      setIsReadyToPrint(true);
    });
  }, [daftarDokumen]);

  useEffect(() => {
    if (isReadyToPrint) {
      const timer = setTimeout(() => {
        window.print();
      }, 800); // Jeda sedikit lebih lama agar browser selesai merender DOM sepenuhnya
      return () => clearTimeout(timer);
    }
  }, [isReadyToPrint]);

  // Loading Screen
  if (!mount || !isReadyToPrint) {
    return (
      <div className="min-h-screen bg-gray-200 flex justify-center items-center print:hidden font-sans text-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
          <h1 className="text-xl font-bold">Memuat dokumen untuk dicetak...</h1>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Container Background untuk Preview Layar */}
      <div className="min-h-screen items-center flex-col bg-gray-200 py-8 print:py-0 print:bg-white flex justify-center font-sans text-black">

        <div className="w-[210mm] border">
          <Button
            className="print:hidden w-fit mb-6"
            onClick={() => window.print()}>
            <PrinterIcon /> Cetak Laporan
          </Button>
        </div>

        {/* Kertas A4 */}
        <div className="bg-white w-[210mm] min-h-[297mm] shadow-xl p-[15mm] print:w-full print:min-h-0 print:p-0 print:shadow-none print:m-0">

          {/* Header Section (Hindari terpotong) */}
          <header className="flex justify-between items-center border-b-2 border-black mb-6 pb-2 print:break-inside-avoid">
            <img src="/images/fakfak-logo.png" className="h-20 object-contain" alt="Logo Kiri" />
            <div className="text-center flex-1 px-4">
              <h1 className="text-xl font-bold uppercase underline underline-offset-4">Laporan Pekerjaan</h1>
            </div>
            <img src="/images/logo.png" className="h-20 object-contain" alt="Logo Kanan" />
          </header>

          {/* Information Table (Hindari terpotong) */}
          <table className="w-full text-sm mb-6 print:break-inside-avoid">
            <tbody>
              <tr>
                <td className="w-40 py-1 align-top">Judul Pekerjaan</td>
                <td className="w-4 align-top">:</td>
                <td className="font-semibold align-top">{judulPekerjaan}</td>
              </tr>
              <tr>
                <td className="py-1 align-top">Waktu Laporan</td>
                <td className="align-top">:</td>
                <td className="font-semibold align-top">{formatDateTimeString(waktuLaporan)}</td>
              </tr>
              <tr>
                <td className="py-1 align-top">Lokasi Pekerjaan</td>
                <td className="align-top">:</td>
                <td className="font-semibold align-top">{lokasiPekerjaan}</td>
              </tr>
              <tr>
                <td className="py-1 align-top">Nama Pelapor</td>
                <td className="align-top">:</td>
                <td className="font-semibold align-top">{namaPelapor}</td>
              </tr>
              <tr>
                <td className="py-1 align-top">PIC Pekerjaan</td>
                <td className="align-top">:</td>
                <td className="font-semibold align-top">{picPekerjaan}</td>
              </tr>
            </tbody>
          </table>

          <p className="text-sm mb-4 print:break-inside-avoid">
            Pada <span className="font-semibold">{formatDateTimeString(waktuLaporan)}</span>, telah dilakukan pelaksanaan pekerjaan. Berikut Dokumentasinya:
          </p>

          {/* Documentation List */}
          <div className="w-full mt-4">
            {daftarDokumen.map((dokumen, index) => {
              // Kumpulkan semua URL gambar untuk dokumen ini
              const urls = dokumen.employeeTaskDocument.flatMap(d => d.fileUrls);

              return (
                <div key={index} className={cn("mb-8", index === 0 && "mt-12")}>
                  {/* Judul dokumen menempel dengan gambar bawahnya */}
                  <h1 className="font-bold text-sm mb-3 print:break-after-avoid">
                    {index + 1}. {dokumen.name}
                  </h1>

                  {/* Render setiap gambar */}
                  <div className="space-y-4">
                    {urls.length > 0 && urls.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Dokumentasi ${dokumen.name}`}
                        // max-h-[200mm] mencegah 1 gambar melebihi tinggi kertas A4
                        // print:break-inside-avoid mencegah gambar terbelah 2 di antar halaman
                        className="w-fit max-h-110 object-contain border p-1 rounded-sm bg-gray-50 print:bg-transparent print:break-inside-avoid"
                      />))}
                    {
                      urls.length === 0 &&
                      <h1 className="text-sm text-muted-foreground italic">Tidak ada gambar.</h1>
                    }
                  </div>
                </div>
              )
            })}
          </div>

          {/* Signature Section */}
          {/* print:break-inside-avoid sangat penting di sini agar tanda tangan tidak pisah halaman */}
          <div className="mt-12 pt-8 pb-12 flex justify-between px-8 text-sm print:break-inside-avoid">
            {/* Dibuat Oleh */}
            <div className="flex flex-col items-center w-48 relative">
              <span className="mb-20">Dibuat oleh,</span>
              {/* Stamp Mockup */}
              {
                (taskReportStatusId === 4 || taskReportStatusId === 2) &&
                <div className="absolute top-10 text-green-600/50 border-2 border-green-600/50 rounded-md px-4 py-1 font-bold tracking-widest text-lg">
                  APPROVED
                </div>
              }
              <span className="font-bold border-b border-black w-full text-center pb-1">
                {namaPelapor}
              </span>
              <span className="mt-1 text-xs text-center">Pengawas Pekerjaan</span>
            </div>

            {/* Disetujui Oleh */}
            <div className="flex flex-col items-center w-48 relative">
              <span className="mb-20">Disetujui Oleh,</span>
              {/* Stamp Mockup */}
              {
                taskReportStatusId === 4 &&
                <div className="absolute top-10 text-green-600/50 border-2 border-green-600/50 rounded-md px-4 py-1 font-bold tracking-widest text-lg">
                  APPROVED
                </div>
              }
              <span className="font-bold border-b border-black w-full text-center pb-1">
                {picPekerjaan}
              </span>
              <span className="mt-1 text-xs text-center">Penanggung Jawab Pekerjaan</span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}