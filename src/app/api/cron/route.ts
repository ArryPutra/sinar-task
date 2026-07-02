import { NextResponse } from 'next/server';
import { updateEmployeeTaskStatus } from '@/features/employee-task/services/update-employee-task-status';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get('secret');

  // Ganti 'KODE_RAHASIA_KAMU' dengan kata sandi acak buatanmu sendiri
  if (secret !== 'KODE_RAHASIA_KAMU') {
    return new NextResponse('Unauthorized/Ditolak', { status: 401 });
  }

  try {
    await updateEmployeeTaskStatus(); 
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
  }
}