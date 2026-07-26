import { getCurrentEmployee } from '@/features/employee/action';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import React from 'react';

export default async function PrintLayout({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <>
            {children}
        </>
    )
}
