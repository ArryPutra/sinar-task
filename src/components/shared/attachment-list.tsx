import { Button } from "@/components/ui/button";
import { ExternalLink, File, FileText, Image } from "lucide-react";

// Helper: Mengambil nama file asli dari URL Cloudinary
const getFilenameFromUrl = (url: string) => {
    try {
        const decodedUrl = decodeURIComponent(url);
        return decodedUrl.split("/").pop() || "Unduh Berkas";
    } catch {
        return "Lihat Lampiran";
    }
};

// Helper: Menentukan ikon berdasarkan tipe berkas
const getFileIcon = (url: string) => {
    const ext = url.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")) {
        return <Image className="h-4 w-4 text-blue-500 shrink-0" />;
    }
    if (["pdf"].includes(ext || "")) {
        return <FileText className="h-4 w-4 text-destructive shrink-0" />;
    }
    return <File className="h-4 w-4 text-muted-foreground shrink-0" />;
};

export function AttachmentList({ fileUrls, label = "Daftar Lampiran File" }: {
    fileUrls: string[] | null;
    label?: string;
}) {
    // State jika tidak ada file yang dikirim
    if (!fileUrls || fileUrls.length === 0) {
        return (
            <p className="text-sm text-muted-foreground italic">
                Tidak ada file yang dilampirkan.
            </p>
        );
    }

    return (
        <div className="grid gap-2 sm:grid-cols-2 w-full">
            {fileUrls.map((fileUrl, index) => {
                const fileName = getFilenameFromUrl(fileUrl);

                return (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-xl border bg-card text-card-foreground shadow-sm transition-all hover:bg-accent/50 group"
                    >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            {getFileIcon(fileUrl)}
                            <span className="text-sm font-medium truncate text-foreground/90 group-hover:text-foreground">
                                {fileName}
                            </span>
                        </div>

                        <Button
                            asChild
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0 ml-2"
                        >
                            <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <ExternalLink className="h-4 w-4" />
                                <span className="sr-only">Buka file</span>
                            </a>
                        </Button>
                    </div>
                );
            })}
        </div>
    );
}