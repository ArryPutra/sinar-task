import { getCloudinarySignature } from "./cloudinary";

export async function uploadToCloudinaryClient(
    file: File,
    folderName: string = "task_documents"
) {
    // 1. Minta tanda tangan ke Server Action (ini aman karena Server Action jalan di Vercel)
    const sign = await getCloudinarySignature(folderName);

    // 2. Upload menggunakan fetch standar (Browser-native)
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", sign.apiKey);
    formData.append("timestamp", String(sign.timestamp));
    formData.append("signature", sign.signature);
    formData.append("folder", sign.folder);

    // Pastikan cloudName tersedia
    const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sign.cloudName}/auto/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!res.ok) {
        throw new Error("Upload gagal");
    }

    return await res.json();
}