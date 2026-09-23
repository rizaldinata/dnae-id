import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validUsername || !validPassword) {
      return NextResponse.json(
        { error: 'Konfigurasi admin belum diatur' },
        { status: 500 }
      );
    }

    if (username === validUsername && password === validPassword) {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Username atau password salah' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Gagal memproses login' },
      { status: 500 }
    );
  }
}
