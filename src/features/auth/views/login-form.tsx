"use client"

import { PasswordInput } from "@/components/shared/password-input";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import GoogleLoginButton from "@/features/auth/components/google-login-button";
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
                                defaultValue="sinartask@gmail.com"
                                required />
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <PasswordInput
                                name="password"
                                id="password"
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
                        <GoogleLoginButton />
                    </FieldGroup>
                </form>
                <span className="font-medium tracking-wide text-xs text-muted-foreground max-md:block">
                    © 2026 PT. Sinar Sejati Group • v1.0.0
                </span>
            </section>

            {/* Right Section */}
            <section className="relative hidden lg:flex flex-col justify-center items-center p-12 text-white selection:bg-blue-500 overflow-hidden">

                <img
                    src="/images/login.jpg"
                    alt="Login Background"
                    className="absolute inset-0 h-full w-full object-cover pointer-events-none dark:brightness-[0.3]"
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
                        Sistem Informasi Manajemen Pekerjaan Internal. Kelola koordinasi antar lini karyawan, supervisor, dan manajer demi produktivitas kerja yang transparan dan efisien.
                    </p>
                </div>

            </section>
        </div>
    )
}