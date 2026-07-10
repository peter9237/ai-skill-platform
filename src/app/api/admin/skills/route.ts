import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const auth = request.headers.get('x-admin-token');
    if (!auth || auth !== (process.env.ADMIN_PASSWORD ?? 'admin123')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const skills = await prisma.skill.findMany({
      where: { status: 'pending' },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ data: skills });
  } catch (error) {
    console.error('GET /api/admin/skills error:', error);
    return NextResponse.json({ error: '获取待审核列表失败' }, { status: 500 });
  }
}
