import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CATEGORIES } from '@/shared/categories';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') ?? 'hot';
    const category = searchParams.get('category') ?? 'all';
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
    const pageSize = Math.min(48, Math.max(1, parseInt(searchParams.get('pageSize') ?? '24', 10)));

    const where: Record<string, unknown> = { status: 'published' };

    if (category !== 'all') {
      const validCategories = CATEGORIES.map((c) => c.id);
      if (validCategories.includes(category as never)) {
        where.category = category;
      }
    }

    const orderBy: Record<string, string> =
      sort === 'new' ? { createdAt: 'desc' } : { stars: 'desc' };

    const [skills, total] = await Promise.all([
      prisma.skill.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          nameLang: true,
          summaryCn: true,
          category: true,
          tags: true,
          sourceType: true,
          sourceUrl: true,
          author: true,
          stars: true,
          platform: true,
          isNew: true,
          createdAt: true,
        },
      }),
      prisma.skill.count({ where }),
    ]);

    return NextResponse.json({
      data: skills.map((s) => ({
        ...s,
        tags: JSON.parse(s.tags as string),
        platform: JSON.parse(s.platform as string),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    });
  } catch (error) {
    console.error('GET /api/skills error:', error);
    return NextResponse.json({ error: '获取 Skill 列表失败' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, summaryCn, description, category, sourceUrl, platform, installCmd, author } =
      body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Skill 名称不能为空' }, { status: 400 });
    }
    if (!summaryCn?.trim()) {
      return NextResponse.json({ error: '中文简介不能为空' }, { status: 400 });
    }
    if (!category || !CATEGORIES.some((c) => c.id === category)) {
      return NextResponse.json({ error: '请选择有效分类' }, { status: 400 });
    }
    if (!sourceUrl?.trim()) {
      return NextResponse.json({ error: '来源链接不能为空' }, { status: 400 });
    }

    // Basic URL validation
    try {
      new URL(sourceUrl);
    } catch {
      return NextResponse.json({ error: '来源链接格式不正确' }, { status: 400 });
    }

    // Check for duplicate source URL
    const existing = await prisma.skill.findFirst({ where: { sourceUrl } });
    if (existing) {
      return NextResponse.json({ error: '该来源链接已存在' }, { status: 409 });
    }

    const skill = await prisma.skill.create({
      data: {
        name: name.trim(),
        summaryCn: summaryCn.trim(),
        description: description?.trim() ?? null,
        category,
        sourceUrl: sourceUrl.trim(),
        sourceType: 'user',
        platform: JSON.stringify(platform ?? ['通用']),
        installCmd: installCmd?.trim() ?? null,
        author: author?.trim() ?? null,
        status: 'pending',
        isNew: 1,
      },
    });

    return NextResponse.json({ data: skill }, { status: 201 });
  } catch (error) {
    console.error('POST /api/skills error:', error);
    return NextResponse.json({ error: '上传失败，请稍后重试' }, { status: 500 });
  }
}
