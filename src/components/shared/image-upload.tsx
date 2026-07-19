"use client";

import { Camera, Image as ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";

interface ImageUploadProps {
    name: string;
    accept?: string;
    defaultPreview?: string[];
    onChange?: (files: File[]) => void;
}

export function ImageUpload({
    name,
    defaultPreview = [],
    onChange,
}: ImageUploadProps) {
    const [previews, setPreviews] = useState<string[]>(defaultPreview);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [mobileUploadType, setMobileUploadType] = useState<"camera" | "file">("file");
    const [openPreviewIndex, setOpenPreviewIndex] = useState<number | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
        const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
        setIsMobile(mobileCheck);
    }, []);

    // Cleanup object URL untuk mencegah memory leak
    useEffect(() => {
        return () => {
            previews.forEach((preview) => {
                if (preview.startsWith("blob:")) {
                    URL.revokeObjectURL(preview);
                }
            });
        };
    }, [previews]);

    // BAGAian PENTING: Sinkronisasi state selectedFiles dengan tag <input> asli
    // Ini memastikan saat form di-submit via FormData, semua file terbawa.
    useEffect(() => {
        if (fileInputRef.current) {
            const dataTransfer = new DataTransfer();
            selectedFiles.forEach((file) => dataTransfer.items.add(file));
            fileInputRef.current.files = dataTransfer.files;
        }
    }, [selectedFiles]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const newFiles = Array.from(e.target.files ?? []);
        if (newFiles.length === 0) return;

        const updatedFiles = [...selectedFiles, ...newFiles];
        setSelectedFiles(updatedFiles);
        onChange?.(updatedFiles);

        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
        
        // JANGAN hapus e.target.value di sini lagi
    }

    function handleRemove(indexToRemove: number) {
        const newPreviews = [...previews];
        const removedPreview = newPreviews.splice(indexToRemove, 1)[0];

        if (removedPreview?.startsWith("blob:")) {
            URL.revokeObjectURL(removedPreview);
        }
        setPreviews(newPreviews);

        const newFiles = [...selectedFiles];
        if (indexToRemove < newFiles.length || newFiles.length === previews.length) {
            newFiles.splice(indexToRemove, 1);
            setSelectedFiles(newFiles);
            onChange?.(newFiles);
        }
    }

    const handleMobileOptionSelect = (type: "camera" | "file") => {
        setMobileUploadType(type);
        setIsSheetOpen(false);

        setTimeout(() => {
            fileInputRef.current?.click();
        }, 100);
    };

    return (
        <div className="space-y-3">
            {/* Bagian Tombol Upload */}
            {!isMobile ? (
                <Input
                    ref={fileInputRef} // Tambahkan ref di sini untuk desktop
                    name={name}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    // Trik agar pengguna bisa memilih file yang sama jika sebelumnya dihapus
                    onClick={(e) => {
                        (e.target as HTMLInputElement).value = "";
                    }}
                />
            ) : (
                <>
                    <Button
                        type="button"
                        variant={previews.length > 0 ? "secondary" : "outline"}
                        className="w-full justify-start text-muted-foreground"
                        onClick={() => setIsSheetOpen(true)}
                    >
                        {previews.length > 0 ? (
                            <><Plus className="mr-2 h-4 w-4" /> Tambah Gambar Lagi...</>
                        ) : (
                            <><ImageIcon className="mr-2 h-4 w-4" /> Pilih Gambar...</>
                        )}
                    </Button>

                    <input
                        ref={fileInputRef}
                        name={name}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple={mobileUploadType === "file"}
                        capture={mobileUploadType === "camera" ? "environment" : undefined}
                        onChange={handleChange}
                        // Trik agar kamera/galeri tetap terbuka walaupun foto yang sama
                        onClick={(e) => {
                            (e.target as HTMLInputElement).value = "";
                        }}
                    />

                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetContent side="bottom" className="rounded-t-xl">
                            <SheetHeader>
                                <SheetTitle className="text-left">Pilih Sumber Gambar</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-3 px-4 pb-4 mt-4">
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="justify-start text-base"
                                    onClick={() => handleMobileOptionSelect("camera")}>
                                    <Camera className="mr-3 h-5 w-5" />
                                    Buka Kamera
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="justify-start text-base"
                                    onClick={() => handleMobileOptionSelect("file")}
                                >
                                    <ImageIcon className="mr-3 h-5 w-5" />
                                    Pilih dari Galeri/File
                                </Button>
                            </div>
                        </SheetContent>
                    </Sheet>
                </>
            )}

            {/* Bagian Preview Gambar */}
            {previews.length > 0 && (
                <div className="flex flex-wrap gap-4 pt-2">
                    {previews.map((preview, index) => (
                        <div key={preview} className="relative group">
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="absolute -right-2 -top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-md transition-transform hover:scale-110 focus:outline-none"
                                aria-label="Hapus gambar"
                            >
                                <X className="h-4 w-4 text-white" />
                            </button>

                            <Dialog
                                open={openPreviewIndex === index}
                                onOpenChange={(isOpen) => setOpenPreviewIndex(isOpen ? index : null)}   
                            >
                                <DialogTrigger asChild>
                                    <button
                                        type="button"
                                        className="overflow-hidden rounded-md border"
                                    >
                                        <Image
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            width={1000}
                                            height={1000}
                                            className="h-24 w-24 rounded-md border object-cover"
                                            unoptimized
                                        />
                                    </button>
                                </DialogTrigger>

                                <DialogContent
                                    className="max-w-5xl border-none bg-black/90 p-0 shadow-none rounded-none"
                                >
                                    <div className="relative h-[85vh] w-full"
                                        onClick={() => setOpenPreviewIndex(null)}>
                                        <Image
                                            src={preview}
                                            alt={`Preview ${index + 1}`}
                                            fill
                                            className="object-contain"
                                            unoptimized
                                        />
                                    </div>

                                    <div className="pointer-events-none w-[80%] text-center absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                                        Klik Gambar untuk Menutup
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}