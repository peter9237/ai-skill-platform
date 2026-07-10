'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getCategoryLabel, getCategoryIcon } from '@/shared/categories';

interface Skill {
  id: string;
  name: string;
  nameLang: string;
  summaryCn: string;
  category: string;
  tags: string[];
  sourceType: string;
  author: string | null;
  stars: number;
  platform: string[];
  isNew: number;
  createdAt: string;
}

function formatTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return '刚刚';
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 周前`;
  return date.toLocaleDateString('zh-CN');
}

function formatStars(stars: number): string {
  if (stars >= 1000) return `${(stars / 1000).toFixed(1)}k`;
  return stars.toString();
}

function getSourceIcon(sourceType: string): string {
  switch (sourceType) {
    case 'github':
      return '🐙';
    case 'marketplace':
      return '🏪';
    case 'community':
      return '💬';
    case 'user':
      return '👤';
    default:
      return '📎';
  }
}

function getPlatformLabel(platform: string[]): string {
  if (!platform || platform.length === 0) return '通用';
  if (platform.includes('通用')) return '通用';
  return platform.slice(0, 2).join(' · ');
}

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/skill/${skill.id}`}>
      <Card className="card-hover h-full cursor-pointer border-gray-100 hover:border-gray-200">
        <CardContent className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              {skill.isNew === 1 && (
                <Badge className="shrink-0 bg-blue-500 hover:bg-blue-500 text-white text-[10px] px-1.5 py-0">
                  NEW
                </Badge>
              )}
              <span className="text-xs text-gray-400 shrink-0">{getSourceIcon(skill.sourceType)}</span>
            </div>
            {skill.stars > 0 && (
              <span className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
                ⭐ {formatStars(skill.stars)}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-semibold text-gray-900 mb-1.5 line-clamp-1 break-all">
            {skill.name}
          </h3>

          {/* Summary */}
          <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">
            {skill.summaryCn}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-2 border-t border-gray-50">
            <div className="flex items-center gap-1.5 min-w-0">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal shrink-0">
                {getCategoryIcon(skill.category)} {getCategoryLabel(skill.category)}
              </Badge>
              <span className="text-xs text-gray-300 truncate">
                {getPlatformLabel(skill.platform)}
              </span>
            </div>
            <span className="text-xs text-gray-300 shrink-0">
              {formatTime(skill.createdAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
