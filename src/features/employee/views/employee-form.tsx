"use client"

import BackButton from '@/components/shared/back-button'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Prisma } from '@/generated/prisma/client'
import { initialActionState } from '@/types/action-state'
import { useRouter } from 'nextjs-toploader/app'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { createEmployeeAction, updateEmployeeAction } from '../action'

export default function EmployeeForm({
    data
}: {
    data?: Prisma.EmployeeGetPayload<{
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    }>
}) {
    const [stateCreate, formActionCreate, isPendingCreate] =
        useActionState(createEmployeeAction, initialActionState);
    const [stateUpdate, formActionUpdate, isPendingUpdate] =
        useActionState(updateEmployeeAction.bind(null, data?.id ?? ""), initialActionState);

    const isEditMode: Boolean = data !== undefined;

    const formAction = isEditMode ? formActionUpdate : formActionCreate;
    const state = isEditMode ? stateUpdate : stateCreate;
    const fields = isEditMode ? stateUpdate.fields : stateCreate.fields;
    const fieldErrors = isEditMode ? stateUpdate.fieldErrors : stateCreate.fieldErrors;
    const isPending = isEditMode ? isPendingUpdate : isPendingCreate;

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            router.push("/admin/employees");
            toast.success(state.message, {
                position: "top-center"
            });
        }
    }, [state.success]);

    return (
        <>
            <BackButton href="/admin/employees" />
            <form action={formAction} className="space-y-4">
                <FieldGroup className='grid grid-cols-2 max-md:flex'>
                    <Field>
                        <FieldLabel htmlFor="name">Nama</FieldLabel>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={fields?.name ?? data?.user.name}
                            placeholder='Masukkan nama' />
                        <FieldError>{fieldErrors?.name}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={fields?.email ?? data?.user.email}
                            placeholder='Masukkan email' />
                        <FieldError>{fieldErrors?.email}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="phoneNumber">Nomor Telepon</FieldLabel>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            defaultValue={fields?.phoneNumber ?? data?.phoneNumber}
                            placeholder='Masukkan nomor telepon' />
                        <FieldError>{fieldErrors?.phoneNumber}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="password">Password {isEditMode && "Baru"}</FieldLabel>
                        <Input
                            id="password"
                            name="password"
                            placeholder={`Masukkan password ${isEditMode ? "Baru" : ""}`} />
                        <FieldError>{fieldErrors?.password}</FieldError>
                    </Field>

                    <Button type="submit" className="col-span-2 w-fit" disabled={isPending}>
                        {isEditMode ? "Perbarui" : "Tambah"} Karyawan {isPending && <Spinner />}
                    </Button>
                </FieldGroup>
            </form>
        </>
    )
}
