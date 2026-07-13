"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { InfoIcon } from "lucide-react";
import { useActionState } from "react";
import { loginAction } from "../actions";

export default function LoginForm() {
    const [state, formAction, isPending] = useActionState(loginAction, null);

    return (
        <div className="grid min-h-svh lg:grid-cols-2">
            {/* Left Section */}
            <section className="flex flex-col items-center justify-center gap-4 p-6 md:p-10 bg-linear-to-br from-white to-blue-50 dark:from-slate-950 dark:to-slate-900">
                <form action={formAction} className="flex flex-col gap-6 w-full max-w-sm">
                    <FieldGroup>
                        <div className="flex flex-col items-center gap-1 text-center">
                            <a href="#" className="flex items-center gap-2 font-medium">
                                <img src="/images/logo-only.png" alt="Logo" className="size-8 object-cover" />
                                Sinar Task
                            </a>
                            <h1 className="text-2xl font-bold mt-2">Selamat Datang</h1>
                            <p className="text-sm text-balance text-muted-foreground whitespace-nowrap max-md:whitespace-normal">
                                Masukkan email dan password Anda untuk login ke akun.
                            </p>
                        </div>
                        {
                            state?.error &&
                            <Alert variant={'destructive'}>
                                <InfoIcon />
                                <AlertTitle>Login gagal</AlertTitle>
                                <AlertDescription>{state.error}</AlertDescription>
                            </Alert>
                        }
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                name="email"
                                id="email"
                                type="email"
                                placeholder="email@gmail.com"
                                defaultValue="admin@gmail.com"
                                required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                name="password"
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                defaultValue="password123"
                            />
                        </Field>
                        <Field>
                            <Button type="submit" className="w-full" disabled={isPending}>
                                Login {isPending && <Spinner />}
                            </Button>
                        </Field>
                        <div className="flex w-full items-center">
                            <Separator className="flex-1" />
                            <span className="mx-4 shrink-0 text-sm text-muted-foreground">
                                Atau lanjut dengan
                            </span>
                            <Separator className="flex-1" />
                        </div>
                        <Button variant="outline" type="button">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                <path
                                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                    fill="currentColor"
                                />
                            </svg>
                            Login with Google
                        </Button>
                    </FieldGroup>
                </form>
                <span className="font-medium tracking-wide text-xs text-gray-700 max-md:block">
                    © 2026 PT. Sinar Sejati Group • v1.0.0
                </span>
            </section>

            {/* Right Section */}
            <section className="relative hidden lg:flex flex-col justify-center items-center p-12 text-white selection:bg-blue-500 overflow-hidden">

                <img
                    src="/images/login.jpg"
                    alt="Login Background"
                    className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3]"
                />

                <div className="absolute inset-0 bg-linear-to-b from-blue-600/70 via-blue-900/80 to-slate-950/95 pointer-events-none" />

                <div className="relative z-10 max-w-md space-y-4 text-center lg:text-left">
                    <span className="text-xs font-bold tracking-widest text-blue-200 uppercase bg-blue-400/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        PT. Sinar Sejati Group
                    </span>
                    <h2 className="text-4xl font-extrabold tracking-tight mt-4">
                        Sinar Task
                    </h2>
                    <p className="text-blue-100/90 text-lg leading-relaxed">
                        Sistem Informasi Manajemen Tugas Internal. Kelola koordinasi antar lini karyawan, supervisor, dan manajer demi produktivitas kerja yang transparan dan efisien.
                    </p>
                </div>

            </section>
        </div>
    )
}