import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRightIcon, ExternalLinkIcon, PhoneIcon, UserIcon, UserX } from "lucide-react";
import Link from "next/link";

export default function EmployeeProfileCard({
  employee,
}: {
  employee: {
    id: string;
    name: string;
    phoneNumber: string;
  } | null;
}) {
  // 1. Tampilan jika data karyawan tidak ditemukan / null
  if (!employee) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
          <div className="rounded-full bg-muted p-3 mb-3">
            <UserX className="size-6 text-muted-foreground/70" />
          </div>
          <p className="text-sm font-medium text-foreground">Data Karyawan Tidak Ditemukan</p>
          <p className="text-xs text-muted-foreground mt-1">
            Ada kesalahan dalam mengambil data karyawan.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Ambil inisial nama secara aman
  const initial = employee.name ? employee.name.charAt(0).toUpperCase() : "?";

  // 2. Tampilan utama jika data karyawan ada
  return (
    <Card>
      <CardHeader className="border-b pb-4">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <UserIcon className="size-4 text-muted-foreground" />
          Informasi Karyawan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {/* Header Profil (Avatar + Nama) */}
        <div className="flex items-center gap-3">
          <Avatar className="size-10 border">
            <AvatarFallback className="text-xs font-semibold bg-muted">
              {initial}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-0.5">
            <p className="text-xs text-muted-foreground font-medium">Nama Karyawan</p>
            <h3 className="text-sm font-semibold text-foreground">{employee.name}</h3>
          </div>
        </div>

        {/* Informasi Kontak (Nomor Telepon) */}
        <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3 border">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <PhoneIcon className="size-3.5" />
            <span>Nomor WhatsApp</span>
          </div>
          <Link href={`https://api.whatsapp.com/send/?phone=${employee.phoneNumber}`}
          className="flex items-center gap-2 hover:underline"
          target="_blank">
            <span className="text-sm font-medium text-foreground">
              {employee.phoneNumber || "-"}
            </span>
            <ExternalLinkIcon className="size-4 text-muted-foreground" />
          </Link>
        </div>
      </CardContent>
      <CardFooter className="flex">
        <Link href={`/admin/employees/${employee.id}`} className="ml-auto">
          <Button size="sm" variant="outline">
            Detail Karyawan <ArrowRightIcon />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}