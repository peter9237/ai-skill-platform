'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getCategoryLabel, getCategoryIcon } from '@/shared/categories';

interface Skill {
  id: string;
  name: string;
  nameLang: string;
  summaryCn: string;
  description: string | null;
  category: string;
  tags: string[];
  sourceType: string;
  sourceUrl: string;
  author: string | null;
  stars: number;
  platform: string[];
  installCmd: string | null;
  sourceUpdatedAt: string | null;
  createdAt: string;
}

interface RelatedSkill {
  id: string;
  name: string;
  summaryCn: string;
  category: string;
  stars: number;
  author: string | null;
}

export function SkillDetailClient({
  skill,
  related,
}: {
  skill: Skill | null;
  related: RelatedSkill[];
}) {
  if (!skill) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Skill 不存在</h1>
        <p className="text-gray-400 mb-6">该 Skill 不存在或已被移除</p>
        <Link href="/">
          <Button variant="outline">返回首页</Button>
        </Link>
      </div>
    );
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getSourceIcon = (sourceType: string): string => {
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
  };

  const getSourceLabel = (sourceType: string): string => {
    switch (sourceType) {
      case 'github':
        return 'GitHub';
      case 'marketplace':
        return '技能市场';
      case 'community':
        return '技术社区';
      case 'user':
        return '用户上传';
      default:
        return '其他';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-6">
        <Link href="/" className="hover:text-gray-600 transition-colors">
          首页
        </Link>
        <span>/</span>
        <Link
          href={`/?category=${skill.category}`}
          className="hover:text-gray-600 transition-colors"
        >
          {getCategoryIcon(skill.category)} {getCategoryLabel(skill.category)}
        </Link>
        <span>/</span>
        <span className="text-gray-600 truncate">{skill.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-50 text-xs">
            {getSourceIcon(skill.sourceType)} {getSourceLabel(skill.sourceType)}
          </Badge>
          {skill.platform.map((p) => (
            <Badge key={p} variant="secondary" className="text-xs">
              {p}
            </Badge>
          ))}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">{skill.name}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
          {skill.author && (
            <span className="flex items-center gap-1">
              <span>👤</span> {skill.author}
            </span>
          )}
          {skill.stars > 0 && (
            <span className="flex items-center gap-1">
              <span>⭐</span> {skill.stars.toLocaleString()}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span>📅</span> 收录于 {formatTime(skill.createdAt)}
          </span>
          {skill.sourceUpdatedAt && (
            <span className="flex items-center gap-1">
              <span>🔄</span> 源更新于 {formatTime(skill.sourceUpdatedAt)}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      <Card className="mb-6 border-gray-100">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">📝 简介</h2>
          <p className="text-gray-600 leading-relaxed">{skill.summaryCn}</p>
        </CardContent>
      </Card>

      {/* Original Description (collapsible) */}
      {skill.description && (
        <Card className="mb-6 border-gray-100">
          <CardContent className="p-6">
            <details>
              <summary className="cursor-pointer text-lg font-semibold text-gray-900 select-none">
                📄 原始描述
              </summary>
              <Separator className="my-3" />
              <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-wrap mt-3">
                {skill.description}
              </p>
            </details>
          </CardContent>
        </Card>
      )}

      {/* Install Command */}
      {skill.installCmd && (
        <Card className="mb-6 border-gray-100">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">📦 安装方式</h2>
            <pre className="bg-gray-900 text-green-400 text-sm p-4 rounded-lg overflow-x-auto">
              <code>{skill.installCmd}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-12">
        <a
          href={skill.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
          查看原始来源
        </a>
        <Link
          href={`/?category=${skill.category}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {getCategoryIcon(skill.category)} 更多{getCategoryLabel(skill.category)} Skill
        </Link>
      </div>

      {/* Related Skills */}
      {related.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">相关 Skill</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {related.map((r) => (
              <Link key={r.id} href={`/skill/${r.id}`}>
                <Card className="card-hover h-full border-gray-100 hover:border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-gray-900 truncate">{r.name}</h3>
                      {r.stars > 0 && (
                        <span className="text-xs text-gray-400 shrink-0 ml-2">⭐ {r.stars}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 line-clamp-2">{r.summaryCn}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                        {getCategoryIcon(r.category)} {getCategoryLabel(r.category)}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
