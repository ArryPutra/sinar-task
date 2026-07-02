export async function register() {
    // Pastikan kode yang butuh Prisma hanya jalan di runtime Node.js
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { startCron } = await import('./src/lib/cron');
        startCron();
    }
}