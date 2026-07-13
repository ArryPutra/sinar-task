"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { createEmployeeAction, createSelfEmployeeAction } from "@/features/employee/action";
import { initialActionState } from "@/types/action-state";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

export default function RegisterEmployeeView({
    user
}: {
    user: {
        name: string;
        email: string;
    }
}) {

    const [state, form, pending] = useActionState(createSelfEmployeeAction, initialActionState);
    const router = useRouter();

    useEffect(() => {
        if (state.success) {
            toast.success("Berhasil mendaftarkan karyawan.");
            router.push("/employee/dashboard")
        }
    }, [state])

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Lengkapi Data</CardTitle>
                <CardDescription>
                    Masukkan nomor telepon untuk mendaftarkan akun Anda sebagai karyawan.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form action={form} className="space-y-4">
                    <Field>
                        <FieldLabel htmlFor="email">
                            Email Terdaftar
                        </FieldLabel>

                        <Input
                            id="email"
                            name="email"
                            defaultValue={user.email}
                            disabled
                        />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="name">
                            Nama
                        </FieldLabel>

                        <Input
                            id="name"
                            name="name"
                            defaultValue={user.name}
                        />
                        <FieldError>{state?.fieldErrors?.name}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="phoneNumber">
                            Nomor Telepon (WhatsApp)
                        </FieldLabel>

                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="08xxxxxxxxxx"
                        />
                        <FieldDescription>
                            Pastikan nomor telepon Anda terdaftar di WhatsApp dan dapat dihubungi.
                        </FieldDescription>
                        <FieldError>{state?.fieldErrors?.phoneNumber?.at(0)}</FieldError>
                    </Field>

                    <Button className="w-full" type="submit">
                        Daftarkan {pending && <Spinner/>}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}