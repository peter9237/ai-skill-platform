import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = request.headers.get('x-admin-token');
    if (!auth || auth !== (process.env.ADMIN_PASSWORD ?? 'admin123')) {
      return NextResponse.json({ error: '未授权' }, { status: 401 });
    }

    const { id } = await params;
    const { action } = await request.json();

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: '无效操作' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'published' : 'rejected';

    const skill = await prisma.skill.update({
      where: { id },
      data: {
        status: newStatus,
        ...(action === 'approve' ? { createdAt: new Date(), isNew: 1 } : {}),
      },
    });

    return NextResponse.json({ data: skill });
  } catch (error) {
    console.error('PUT /api/admin/skills/[id] error:', error);
    return NextResponse.json({ error: '审核操作失败' }, { status: 500 });
  }
}
