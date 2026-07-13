'use client';

import { useState, useEffect, useCallback } from 'react';
import { SkillCard } from '@/components/SkillCard';
import { SkillCardSkeleton } from '@/components/SkillCardSkeleton';
import { CATEGORIES } from '@/shared/categories';

interface Skill {
  id: string;
  name: string;
  nameLang: string;
  summaryCn: string;
  category: string;
  tags: string[];
  sourceType: string;
  sourceUrl: string;
  author: string | null;
  stars: number;
  platform: string[];
  isNew: number;
  createdAt: string;
}

interface PaginatedResponse {
  data: Skill[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export default function HomePage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [sort, setSort] = useState<'hot' | 'new'>('hot');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        sort,
        category,
        page: page.toString(),
        pageSize: '24',
      });
      const res = await fetch(`/api/skills?${params}`);
      if (!res.ok) throw new Error('Failed to fetch');
      const data: PaginatedResponse = await res.json();
      setSkills(data.data);
      setTotalPages(data.totalPages);
      setTotal(data.total);
    } catch {
      setError('加载失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  }, [sort, category, page]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    setPage(1);
  }, [sort, category]);

  const handleSortChange = (newSort: 'hot' | 'new') => {
    if (newSort !== sort) setSort(newSort);
  };

  const handleCategoryChange = (newCategory: string) => {
    if (newCategory !== category) setCategory(newCategory);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-20">
        {/* Hero */}
        <header className="mb-16">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-zinc-900 mb-4">
            发现优质 AI 技能
          </h1>
          <p className="text-[15px] text-zinc-500 max-w-xl leading-relaxed">
            聚合全球 AI Skill，每日自动采集。中文浏览，轻松发现。
          </p>
          <p className="text-[13px] text-zinc-400 mt-3 tabular-nums">
            {total.toLocaleString()} 个 Skill 已收录
          </p>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          {/* Sort */}
          <div className="inline-flex items-center rounded-lg border border-zinc-200 p-0.5">
            {(['hot', 'new'] as const).map((s) => (
              <button
                key={s}
                onClick={() => handleSortChange(s)}
                className={`px-3.5 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                  sort === s
                    ? 'bg-zinc-900 text-white'
                    : 'text-zinc-500 hover:text-zinc-800'
                }`}
              >
                {s === 'hot' ? '最热' : '最新'}
              </button>
            ))}
          </div>

          {/* Category */}
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label="全部"
              active={category === 'all'}
              onClick={() => handleCategoryChange('all')}
            />
            {CATEGORIES.map((cat) => (
              <FilterChip
                key={cat.id}
                label={`${cat.icon} ${cat.label}`}
                active={category === cat.id}
                onClick={() => handleCategoryChange(cat.id)}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkillCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <p className="text-zinc-400 text-sm mb-4">{error}</p>
            <button
              onClick={fetchSkills}
              className="px-4 py-2 text-[13px] text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              重新加载
            </button>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-zinc-400 text-sm mb-1">暂无相关内容</p>
            <p className="text-zinc-300 text-[13px] mb-5">当前筛选条件下没有找到 Skill</p>
            <button
              onClick={() => {
                setCategory('all');
                setSort('hot');
              }}
              className="px-4 py-2 text-[13px] text-zinc-700 bg-white border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
            >
              清除筛选
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((skill, index) => (
                <div
                  key={skill.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <SkillCard skill={skill} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-12">
                <PageButton
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  label="上一页"
                />
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 text-[13px] rounded-md transition-colors ${
                      p === page
                        ? 'bg-zinc-900 text-white'
                        : 'text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <PageButton
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  label="下一页"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[13px] rounded-full border transition-colors ${
        active
          ? 'bg-zinc-900 text-white border-zinc-900'
          : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-300 hover:text-zinc-700'
      }`}
    >
      {label}
    </button>
  );
}

function PageButton({
  onClick,
  disabled,
  label,
}: {
  onClick: () => void;
  disabled: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-3 py-1.5 text-[13px] rounded-md text-zinc-500 border border-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-50 transition-colors"
    >
      {label}
    </button>
  );
}
