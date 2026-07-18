"use client"

import { AttachmentList } from "@/components/shared/attachment-list"
import BackButton from "@/components/shared/back-button"
import UploadFile from "@/components/shared/file-upload"
import LeafletMap from "@/components/shared/leaflet-map/leaflet-map"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
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
import { formatToDateLocal } from "@/utils/date"
import { useRouter } from "nextjs-toploader/app"
import { Fragment, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { createEmployeeTaskAction, updateEmployeeTaskByIdAction } from "../../actions"

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
                            defaultValue={fields?.title ?? data?.title ?? "Membuat Aplikasi"}
                            placeholder="Masukkan judul" />
                        <FieldError>{fieldErrors?.title}</FieldError>
                    </Field>
                    <Field className="w-full">
                        <FieldLabel htmlFor="employeeTaskCategoryId">Kategori Pekerjaan Karyawan</FieldLabel>
                        <Select name="employeeTaskCategoryId"
                            defaultValue={fields?.employeeTaskCategoryId ?? data?.employeeTaskCategoryId.toString() ?? "3"}>
                            <SelectTrigger>
                                <SelectValue placeholder="Pilih Kategori Pekerjaan Karyawan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Pilih Kategori Pekerjaan Karyawan</SelectLabel>
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
                        <FieldLabel htmlFor="startAt">Tanggal Mulai Tempo (WITA)</FieldLabel>
                        <Input
                            id="startAt"
                            name="startAt"
                            type="date"
                            defaultValue={formatToDateLocal(fields?.startAt ?? data?.startAt)} />
                        <FieldError>{fieldErrors?.startAt}</FieldError>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="dueAt">Tanggal Jatuh Tempo (WITA)</FieldLabel>
                        <Input
                            id="dueAt"
                            name="dueAt"
                            type="date"
                            defaultValue={formatToDateLocal(fields?.dueAt ?? data?.dueAt)} />
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
                    <Field>
                        <FieldLabel htmlFor="locationName">Nama Lokasi</FieldLabel>
                        <Input
                            id="locationName"
                            name="locationName"
                            defaultValue={fields?.locationName ?? data?.locationName ?? "Murjani"}
                            placeholder="Masukkan nama lokasi" />
                        <FieldError>{fieldErrors?.locationName}</FieldError>
                    </Field>
                    <Field className="col-span-2">
                        <FieldLabel>Lampiran File</FieldLabel>
                        <UploadFile
                            name="fileUrls" />
                        <AttachmentList
                            fileUrls={data?.fileUrls ?? []} />
                        <FieldError>{fieldErrors?.fileUrls}</FieldError>
                    </Field>
                    <Field className="col-span-2">
                        <LeafletMap
                            showInput={true}
                            latitude={fields?.latitude ?? data?.latitude}
                            longitude={fields?.longitude ?? data?.longitude} />
                        <FieldError>{fieldErrors?.latitude}</FieldError>
                        <FieldError>{fieldErrors?.longitude}</FieldError>
                    </Field>

                    <Field orientation="horizontal">
                        <Checkbox
                            id="send-whatsapp"
                            name="send-whatsapp"
                            defaultChecked={isEditMode === true ? false : true}
                        />
                        <FieldContent>
                            <FieldLabel htmlFor="send-whatsapp">
                                Kirim notifikasi WhatsApp
                            </FieldLabel>
                            <FieldDescription>
                                Kirim juga notifikasi pesan pekerjaan ini ke nomor WhatsApp pegawai.
                            </FieldDescription>
                        </FieldContent>
                    </Field>

                    <Button type="submit" className="col-span-2 w-fit" disabled={isPending}>
                        {isEditMode ? "Perbarui" : "Tambah"} Pekerjaan {isPending && <Spinner />}
                    </Button>
                </FieldGroup>
            </form>
        </>
    )
}
