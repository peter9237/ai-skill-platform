import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

    if (password !== adminPassword) {
      return NextResponse.json({ error: '密码错误' }, { status: 401 });
    }

    return NextResponse.json({ token: 'authenticated' });
  } catch {
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}
