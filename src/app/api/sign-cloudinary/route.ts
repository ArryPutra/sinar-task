import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // Terima nama folder dari request frontend
        const body = await request.json();
        const folderName = body.folder || 'general';

        const timestamp = Math.round(new Date().getTime() / 1000);

        // Parameter tambahan (seperti folder) WAJIB dimasukkan saat membuat signature
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp,
                folder: folderName // Masukkan folder ke dalam tanda tangan
            },
            process.env.CLOUDINARY_API_SECRET!
        );

        return NextResponse.json({ timestamp, signature, folder: folderName });
    } catch (error) {
        return NextResponse.json({ error: 'Gagal membuat signature' }, { status: 500 });
    }
}