"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ImageUploadProps {
    name: string;
    accept?: string;
    defaultPreview?: string[];
    onChange?: (files: File[]) => void;
}

export function ImageUpload({
    name,
    accept = "image/*",
    defaultPreview = [],
    onChange,
}: ImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>(defaultPreview);

    useEffect(() => {
        return () => {
            previews.forEach((preview) => {
                if (preview.startsWith("blob:")) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [previews]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(e.target.files ?? []);

        onChange?.(files);

        previews.forEach((preview) => {
            if (preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        });

        setPreviews(files.map((file) => URL.createObjectURL(file)));
    }

    return (
        <div className="space-y-3">
            <Input
                name={name}
                type="file"
                accept={accept}
                multiple
                onChange={handleChange}
            />

            {previews.length > 0 && (
                <div className="flex flex-wrap gap-4">
                    {previews.map((preview, index) => (
                        <Dialog key={preview}>
                            <DialogTrigger asChild>
                                <button
                                    type="button"
                                    className="overflow-hidden rounded-md border"
                                >
                                    <Image
                                        key={preview}
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        width={1000}
                                        height={1000}
                                        className="h-48 w-auto rounded-md border object-contain"
                                        unoptimized
                                    />
                                </button>
                            </DialogTrigger>

                            <DialogContent
                                className="max-w-5xl border-none bg-black/90 p-0 shadow-none rounded-none"
                            >
                                <div className="relative h-[85vh] w-full">
                                    <Image
                                        src={preview}
                                        alt={`Preview ${index + 1}`}
                                        fill
                                        className="object-contain"
                                        unoptimized
                                    />
                                </div>

                                <div className="pointer-events-none absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-2 text-sm text-white">
                                    Gambar {index + 1} dari {previews.length}
                                </div>
                            </DialogContent>
                        </Dialog>
                    ))}
                </div>
            )}
        </div>
    );
}