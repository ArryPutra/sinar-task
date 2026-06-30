"use client"

import BackButton from "@/components/back-button"
import GoogleMap from "@/components/google-map"
import { Button } from "@/components/ui/button"
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from "@/components/ui/combobox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { EmployeeTaskCategory, Prisma } from "@/generated/prisma/client"
import { initialActionState } from "@/types/action-state"
import { formatToDatetimeLocal } from "@/utils/date"
import { useRouter } from "nextjs-toploader/app"
import { Fragment, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { createEmployeeTaskAction, updateEmployeeTaskByIdAction } from "../actions"

export default function EmployeeTaskForm({
    data,
    employeeTaskCategory,
    employee
}: {
    data?: Prisma.EmployeeTaskGetPayload<{
        include: {
            employeeTaskAssignment: {
                select: {
                    employeeId: true
                }
            }
        }
    }>,
    employeeTaskCategory: EmployeeTaskCategory[]
    employee: Prisma.EmployeeGetPayload<{
        include: {
            user: {
                select: {
                    name: true
                }
            }
        }
    }>[]
}) {

    const [stateCreate, formActionCreate, isPendingCreate] =
        useActionState(createEmployeeTaskAction, initialActionState);
    const [stateUpdate, formActionUpdate, isPendingUpdate] =
        useActionState(updateEmployeeTaskByIdAction.bind(null, data?.id ?? ""), initialActionState);

    const isEditMode: Boolean = data !== undefined;

    const formAction = isEditMode ? formActionUpdate : formActionCreate;
    const state = isEditMode ? stateUpdate : stateCreate;
    const fields = isEditMode ? stateUpdate.fields : stateCreate.fields;
    const fieldErrors = isEditMode ? stateUpdate.fieldErrors : stateCreate.fieldErrors;
    const isPending = isEditMode ? isPendingUpdate : isPendingCreate;

    const router = useRouter()

    useEffect(() => {
        if (state.success) {
            toast.success(state.message, {
                position: "top-center"
            });
            router.push("/admin/employee-tasks");
        } else {
            if (state.message) {
                toast.error(state.message, {
                    position: "top-center"
                });
            }
        }
    }, [state.success]);

    const anchor = useComboboxAnchor();
    const [selectedEmployee, setSelectedEmployee] =
        useState(data?.employeeTaskAssignment.map((assignment) => assignment.employeeId) ?? []);

    return (
        <>
            <BackButton href="/admin/employee-tasks" />
            <form action={formAction} className="space-y-4">
                <FieldGroup className="grid grid-cols-2 max-md:flex">
                    <Field>
                        <FieldLabel htmlFor="title">Judul</FieldLabel>
                        <Input
                            id="title"
                            name="title"
                            defaultValue={fields?.title ?? data?.title}
                            placeholder="Masukkan judul" />
                        <FieldError>{fieldErrors?.title}</FieldError>
                    </Field>
                    <Field className="w-full">
                        <FieldLabel htmlFor="employeeTaskCategoryId">Kategori Tugas Karyawan</FieldLabel>
                        <Select name="employeeTaskCategoryId"
                            defaultValue={fields?.employeeTaskCategoryId ?? data?.employeeTaskCategoryId.toString()}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Kategori Tugas Karyawan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Pilih Kategori Tugas Karyawan</SelectLabel>
                                    {
                                        employeeTaskCategory.map((item) => (
                                            <SelectItem
                                                value={item.id.toString()}
                                                key={item.id}>
                                                {item.name}
                                            </SelectItem>
                                        ))
                                    }
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FieldError>{fieldErrors?.employeeTaskCategoryId}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="startAt">Tanggal Mulai Tempo</FieldLabel>
                        <Input
                            id="startAt"
                            name="startAt"
                            type="datetime-local"
                            defaultValue={formatToDatetimeLocal(fields?.startAt ?? data?.startAt)} />
                        <FieldError>{fieldErrors?.startAt}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="dueAt">Tanggal Jatuh Tempo</FieldLabel>
                        <Input
                            id="dueAt"
                            name="dueAt"
                            type="datetime-local"
                            defaultValue={formatToDatetimeLocal(fields?.dueAt ?? data?.dueAt)} />
                        <FieldError>{fieldErrors?.dueAt}</FieldError>
                    </Field>
                    <Field className="col-span-2">
                        <FieldLabel htmlFor="description">Deskripsi</FieldLabel>
                        <Textarea
                            id="description"
                            name="description"
                            defaultValue={fields?.description ?? data?.description}
                            placeholder="Masukkan deskripsi" />
                        <FieldError>{fieldErrors?.description}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="employeeIds">Karyawan Ditugaskan</FieldLabel>
                        <Combobox
                            name="employeeIds"
                            multiple
                            autoHighlight
                            items={employee}
                            value={selectedEmployee}
                            onValueChange={setSelectedEmployee}>
                            <ComboboxChips ref={anchor} className="w-full">
                                <ComboboxValue>
                                    {(values) => (
                                        <Fragment>
                                            {values.map((value: string) => {
                                                const selectedEmployee = employee.find((emp) => emp.id === value);
                                                const displayName = selectedEmployee?.user?.name ?? "Tanpa Nama";

                                                return (
                                                    <ComboboxChip key={value}>
                                                        {selectedEmployee?.user?.name ?? displayName}
                                                    </ComboboxChip>
                                                );
                                            })}
                                            <ComboboxChipsInput id="employeeIds" />
                                        </Fragment>
                                    )}
                                </ComboboxValue>
                            </ComboboxChips>
                            <ComboboxContent anchor={anchor}>
                                <ComboboxEmpty>Karyawan tidak ditemukan.</ComboboxEmpty>
                                <ComboboxList>
                                    {(item) => (
                                        <ComboboxItem key={item.id} value={item.id}>
                                            {item.user?.name ?? "Tanpa Nama"}
                                        </ComboboxItem>
                                    )}
                                </ComboboxList>
                            </ComboboxContent>
                        </Combobox>
                    </Field>
                    <Field className="col-span-2">
                        <GoogleMap 
                        showInput={true}
                        latitude={fields?.latitude ?? data?.latitude}
                        longitude={fields?.longitude ?? data?.longitude} />
                        <FieldError>{fieldErrors?.latitude}</FieldError>
                        <FieldError>{fieldErrors?.longitude}</FieldError>
                    </Field>

                    <Button type="submit" className="col-span-2 w-fit" disabled={isPending}>
                        {isEditMode ? "Perbarui" : "Tambah"} Tugas {isPending && <Spinner />}
                    </Button>
                </FieldGroup>
            </form>
        </>
    )
}
