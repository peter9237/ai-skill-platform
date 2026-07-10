import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const skill = await prisma.skill.findUnique({ where: { id } });

    if (!skill || skill.status !== 'published') {
      return NextResponse.json({ error: 'Skill 不存在' }, { status: 404 });
    }

    // Increment view count (fire and forget)
    prisma.skill.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

    // Get related skills (same category, excluding current)
    const related = await prisma.skill.findMany({
      where: {
        category: skill.category,
        status: 'published',
        id: { not: id },
      },
      orderBy: { stars: 'desc' },
      take: 4,
      select: {
        id: true,
        name: true,
        summaryCn: true,
        category: true,
        stars: true,
        author: true,
      },
    });

    return NextResponse.json({
      data: {
        ...skill,
        tags: JSON.parse(skill.tags as string),
        platform: JSON.parse(skill.platform as string),
      },
      related: related.map((r) => ({
        ...r,
        tags: '[]',
        platform: '[]',
      })),
    });
  } catch (error) {
    console.error('GET /api/skills/[id] error:', error);
    return NextResponse.json({ error: '获取 Skill 详情失败' }, { status: 500 });
  }
}
