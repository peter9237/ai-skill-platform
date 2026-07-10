import { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { SkillDetailClient } from './SkillDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

async function getSkill(id: string) {
  const skill = await prisma.skill.findUnique({ where: { id } });
  if (!skill || skill.status !== 'published') return null;

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

  return {
    ...skill,
    tags: JSON.parse(skill.tags as string),
    platform: JSON.parse(skill.platform as string),
    createdAt: skill.createdAt.toISOString(),
    updatedAt: skill.updatedAt.toISOString(),
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const skill = await getSkill(id);
  if (!skill) return { title: 'Skill 不存在 - AI Skill Hub' };

  return {
    title: `${skill.name} - AI Skill Hub`,
    description: skill.summaryCn,
  };
}

export default async function SkillDetailPage({ params }: Props) {
  const { id } = await params;
  const skill = await getSkill(id);

  // Increment view count
  if (skill) {
    prisma.skill.update({ where: { id }, data: { viewCount: { increment: 1 } } }).catch(() => {});
  }

  // Get related
  const related = skill
    ? await prisma.skill.findMany({
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
      })
    : [];

  return <SkillDetailClient skill={skill} related={related} />;
}
