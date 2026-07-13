'use client';

import Link from 'next/link';
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
      return '⌥'; // 极简符号代替 emoji
    case 'marketplace':
      return '◈';
    case 'community':
      return '◍';
    case 'user':
      return '◇';
    default:
      return '·';
  }
}

function getPlatformLabel(platform: string[]): string {
  if (!platform || platform.length === 0) return '通用';
  if (platform.includes('通用')) return '通用';
  return platform.slice(0, 2).join(' · ');
}

export function SkillCard({ skill }: { skill: Skill }) {
  return (
    <Link href={`/skill/${skill.id}`} className="group block h-full">
      <div className="h-full border border-zinc-200 rounded-xl transition-all duration-200 group-hover:border-zinc-300 group-hover:shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)] group-hover:-translate-y-0.5">
        <div className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {skill.isNew === 1 && (
                <span className="text-[10px] font-medium tracking-wider text-zinc-400 uppercase">
                  New
                </span>
              )}
              <span className="text-zinc-300 text-sm leading-none">
                {getSourceIcon(skill.sourceType)}
              </span>
            </div>
            {skill.stars > 0 && (
              <span className="text-xs text-zinc-400 tabular-nums">
                {formatStars(skill.stars)}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="font-medium text-[15px] text-zinc-900 leading-snug mb-2 truncate">
            {skill.name}
          </h3>

          {/* Summary */}
          <p className="text-[13px] leading-relaxed text-zinc-500 line-clamp-2 mb-4 flex-1">
            {skill.summaryCn}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-zinc-100">
            <span className="text-[11px] text-zinc-400 truncate">
              {getCategoryIcon(skill.category)} {getCategoryLabel(skill.category)}
            </span>
            <span className="text-[11px] text-zinc-300 shrink-0 tabular-nums">
              {formatTime(skill.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
