"use client"

import BackButton from '@/components/back-button'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { Textarea } from '@/components/ui/textarea'
import { EmployeeTaskCategory } from '@/generated/prisma/client'
import { initialActionState } from '@/types/action-state'
import { useRouter } from 'nextjs-toploader/app'
import { useActionState, useEffect } from 'react'
import { toast } from 'sonner'
import { createEmployeeTaskCategoryAction, updateEmployeeTaskCategoryByIdAction } from '../actions'

export default function EmployeeTaskCategoryForm({
    data
}: {
    data?: EmployeeTaskCategory
}) {

    const [stateCreate, formActionCreate, isPendingCreate] =
        useActionState(createEmployeeTaskCategoryAction, initialActionState);
    const [stateUpdate, formActionUpdate, isPendingUpdate] =
        useActionState(updateEmployeeTaskCategoryByIdAction.bind(null, data?.id ?? -1), initialActionState);

    const isEditMode: Boolean = data !== undefined;

    const formAction = isEditMode ? formActionUpdate : formActionCreate;
    const state = isEditMode ? stateUpdate : stateCreate;
    const fields = isEditMode ? stateUpdate.fields : stateCreate.fields;
    const fieldErrors = isEditMode ? stateUpdate.fieldErrors : stateCreate.fieldErrors;
    const isPending = isEditMode ? isPendingUpdate : isPendingCreate;

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            router.push("/admin/employee-task-categories");
            toast.success(state.message, {
                position: "top-center"
            });
        }
    }, [state.success]);

    return (
        <>
            <BackButton href="/admin/employee-task-categories" />
            <form action={formAction} className="space-y-4">
                <FieldGroup className='grid grid-cols-2 max-md:flex'>
                    <Field>
                        <FieldLabel htmlFor="name">Nama</FieldLabel>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={fields?.name ?? data?.name} />
                        <FieldError>{fieldErrors?.name}</FieldError>
                    </Field>
                    <Field className='col-span-2'>
                        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={fields?.description ?? data?.description} />
                        <FieldError>{fieldErrors?.description}</FieldError>
                    </Field>

                    <Button type="submit" className="col-span-2 w-fit" disabled={isPending}>
                        {isEditMode ? "Perbarui" : "Tambah"} Kategori Tugas {isPending && <Spinner />}
                    </Button>
                </FieldGroup>
            </form>
        </>
    )
}
