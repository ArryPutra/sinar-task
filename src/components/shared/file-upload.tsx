"use client";

import { File as FileIcon, FileText, Image, UploadCloud, X } from 'lucide-react';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

interface UploadFileProps {
    name: string;          // Nama untuk field file baru (misal: "fileUrls")
    label?: string;         // Label untuk field file baru (misal: "Lampiran Bukti Kerja")
}

export default function UploadFile({
    name,
    label = "Klik untuk menambah file"
}: UploadFileProps) {
    // State untuk file baru yang dipilih (berupa objek File asli)
    const [newFiles, setNewFiles] = useState<File[]>([]);

    // 1. Tambahkan ref untuk mendeteksi input file secara spesifik jika dibutuhkan
    const inputRef = useRef<HTMLInputElement>(null);

    // 2. Efek untuk mendengarkan event 'reset' dari form parent terdekat
    useEffect(() => {
        const inputEl = inputRef.current;
        if (!inputEl) return;

        // Cari form parent terdekat
        const formEl = inputEl.closest('form');
        if (!formEl) return;

        const handleFormReset = () => {
            setNewFiles([]); // Hapus semua state file saat form di-reset
        };

        // Pasang event listener ke form
        formEl.addEventListener('reset', handleFormReset);

        // Bersihkan listener saat komponen unmount
        return () => {
            formEl.removeEventListener('reset', handleFormReset);
        };
    }, []);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const mergedFiles = [...newFiles, ...Array.from(e.target.files)];

        setNewFiles(mergedFiles);

        const dataTransfer = new DataTransfer();

        mergedFiles.forEach((file) => {
            dataTransfer.items.add(file);
        });

        if (inputRef.current) {
            inputRef.current.files = dataTransfer.files;
        }
    };

    const removeNewFile = (indexToRemove: number) => {
        const updatedFiles = newFiles.filter((_, index) => index !== indexToRemove);

        setNewFiles(updatedFiles);

        if (inputRef.current) {
            const dataTransfer = new DataTransfer();

            updatedFiles.forEach((file) => {
                dataTransfer.items.add(file);
            });

            inputRef.current.files = dataTransfer.files;
        }
    };

    const getFileIcon = (fileName: string) => {
        const ext = fileName.split('.').pop()?.toLowerCase();
        if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext || '')) return <Image className="h-4 w-4 text-blue-500 shrink-0" />;
        if (ext === 'pdf') return <FileText className="h-4 w-4 text-destructive shrink-0" />;
        return <FileIcon className="h-4 w-4 text-muted-foreground shrink-0" />;
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 B";

        const k = 1024;
        const sizes = ["B", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    };

    return (
        <div className="w-full space-y-3">
            {/* Dropzone Area */}
            <label
                htmlFor="file-upload"
                className="group relative flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-input bg-input/10 py-6 px-4 text-center transition-colors hover:bg-input/20 hover:border-ring cursor-pointer"
            >
                <input
                    ref={inputRef} // 3. Pasang ref di sini
                    id="file-upload"
                    type="file"
                    name={name}
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,application/pdf"
                />

                <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                    <div className="rounded-full bg-background p-2.5 text-muted-foreground group-hover:text-foreground transition-colors border shadow-sm">
                        <UploadCloud className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col gap-0.5">
                        <p className="text-sm font-medium">
                            <span className="text-blue-500 font-semibold group-hover:text-blue-600">{label}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">Mendukung Gambar & PDF</p>
                    </div>
                </div>
            </label>

            {/* LIST PREVIEW FILE */}
            {newFiles.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground pl-1">Berkas Terlampir:</p>
                    <div className="grid gap-2 sm:grid-cols-2 w-full">
                        {newFiles.map((file, idx) => (
                            <div key={`new-${idx}`} className="flex items-center justify-between p-2.5 rounded-lg border bg-card text-sm shadow-sm animate-in fade-in-50 duration-150">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                    {getFileIcon(file.name)}

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-medium text-foreground">
                                            {file.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {formatFileSize(file.size)}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] bg-blue-500/10 text-blue-600 px-1.5 py-0.5 rounded-full border border-blue-500/20">
                                            Baru
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() => removeNewFile(idx)}
                                            className="rounded p-1 hover:bg-red-100 text-red-500 dark:hover:bg-red-900/20 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}