"use server"

import LoginForm from "@/features/auth/views/login-form";   

export default async function LoginPage() {
    return (
        <LoginForm />
    );
}
