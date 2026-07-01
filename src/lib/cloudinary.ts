import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Fungsi pembantu (helper) yang bisa diimpor dari mana saja
export async function uploadStreamToCloudinary(file: File, folderName: string = 'general') {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<any>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: folderName,
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        ).end(buffer);
    });
}

// Tambahkan di bawah fungsi uploadStreamToCloudinary Anda

export async function deleteFileFromCloudinary(fileUrl: string) {
    try {
        // 1. Ambil resource_type dari URL (contoh: 'image', 'video', 'raw')
        // Berdasarkan struktur: https://res.cloudinary.com/<cloud_name>/<resource_type>/...
        const urlParts = fileUrl.split('/');
        const resourceType = urlParts[4];

        // 2. Ekstrak public_id
        const uploadIndex = fileUrl.indexOf('/upload/');
        if (uploadIndex === -1) {
            throw new Error('URL Cloudinary tidak valid.');
        }

        // Ambil bagian setelah '/upload/' -> "v1782916953/employee_tasks/file_nnfoqp.pdf"
        let path = fileUrl.substring(uploadIndex + 8);

        // Hapus tag versi (misal: "v1782916953/") jika ada
        path = path.replace(/^v\d+\//, '');

        // Hapus ekstensi file (.pdf, .jpg, dll) karena public_id biasanya tidak menyertakan ekstensi
        // (Kecuali jika tipe resourcenya 'raw', ekstensinya tetap ikut menjadi public_id)
        const publicId = resourceType === 'raw' ? path : path.substring(0, path.lastIndexOf('.'));

        // 3. Proses hapus file melalui API Cloudinary
        return new Promise<any>((resolve, reject) => {
            cloudinary.uploader.destroy(
                publicId,
                { resource_type: resourceType }, // Penting agar Cloudinary tahu tipe file yang dihapus
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            );
        });
    } catch (error) {
        console.error('Terjadi kesalahan saat mengekstrak URL atau menghapus file:', error);
        throw error;
    }
}