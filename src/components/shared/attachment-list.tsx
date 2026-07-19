"use client";

import { Button } from "@/components/ui/button";
import {
  ExternalLink,
  File,
  FileText,
  Image,
  Trash2Icon,
  X
} from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogMedia, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";

const getFilenameFromUrl = (url: string) => {
  try {
    const decodedUrl = decodeURIComponent(url);
    return decodedUrl.split("/").pop() || "Unduh Berkas";
  } catch {
    return "Lihat Lampiran";
  }
};

const getFileIcon = (url: string) => {
  const ext = url.split(".").pop()?.toLowerCase();

  if (["jpg", "jpeg", "png", "webp", "gif"].includes(ext || "")) {
    return <Image className="h-4 w-4 text-blue-500 shrink-0" />;
  }

  if (ext === "pdf") {
    return <FileText className="h-4 w-4 text-destructive shrink-0" />;
  }

  return <File className="h-4 w-4 text-muted-foreground shrink-0" />;
};

export function AttachmentList({
  fileUrls,
  onRemove,
}: {
  fileUrls: string[] | null;
  onRemove?: (fileUrl: string, index: number) => void;
}) {
  if (!fileUrls || fileUrls.length === 0) {
    return (
      <p className="text-sm italic text-muted-foreground">
        Tidak ada file yang dilampirkan.
      </p>
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-3 w-full">
      {fileUrls.map((fileUrl, index) => {
        const fileName = getFilenameFromUrl(fileUrl);

        return (
          <div
            key={index}
            // className="flex flex-1 flex-wrap items-center justify-between rounded-xl border bg-card p-3 shadow-sm transition-all hover:bg-accent/50 group"
            className="flex min-w-0 flex-1 items-center justify-between rounded-xl border bg-card p-3 shadow-sm transition-all hover:bg-accent/50 group"
          >
            <div className="flex min-w-0 items-center gap-3 w-full">
              {getFileIcon(fileUrl)}

              <span className="flex-1 truncate text-sm font-medium">
                {fileName}
              </span>
            </div>

            <div className="flex items-center">
              <Button
                asChild
                variant="ghost"
                size="icon"
                className="h-8 w-8"
              >
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>

              {onRemove && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive">
                      <X className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent size="sm">
                    <AlertDialogHeader>
                      <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                        <Trash2Icon />
                      </AlertDialogMedia>
                      <AlertDialogTitle>Hapus gambar?</AlertDialogTitle>
                      <AlertDialogDescription>
                        File yang dihapus tidak dapat dikembalikan.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel variant="outline">Batal</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => onRemove(fileUrl, index)}>
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}