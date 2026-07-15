import React from 'react'

export default function ProfileView({
    data
}: {
    data: {
        name: string
        email: string
        phoneNumber: string
    }
}) {
  return (
    <div className="w-full">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-semibold text-primary-foreground">
                        {data.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1 className="text-xl font-semibold">
                            {data.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Karyawan
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Nama
                        </p>
                        <p className="font-medium">
                            {data.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Email
                        </p>
                        <p className="font-medium">
                            {data.email}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Nomor Telepon
                        </p>
                        <p className="font-medium">
                            {data.phoneNumber || "-"}
                        </p>
                    </div>
                </div>
            </div>
        </div>
  )
}
