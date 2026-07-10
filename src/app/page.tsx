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

  // Reset page when sort or category changes
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          发现优质 AI 技能
        </h1>
        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          每日自动采集全球最新 AI Skill，覆盖 Claude Code、Codex、Cursor 等主流平台。
          中文浏览，轻松发现。
        </p>
        <p className="text-sm text-gray-400 mt-2">
          已收录 <span className="font-semibold text-gray-600">{total.toLocaleString()}</span> 个 Skill
        </p>
      </div>

      {/* Sort Toggle */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-gray-400 mr-1">排序：</span>
        <button
          onClick={() => handleSortChange('hot')}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            sort === 'hot'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          🔥 最热
        </button>
        <button
          onClick={() => handleSortChange('new')}
          className={`px-4 py-1.5 text-sm font-medium rounded-full transition-colors ${
            sort === 'new'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          🆕 最新
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => handleCategoryChange('all')}
          className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
            category === 'all'
              ? 'bg-gray-900 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          全部
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategoryChange(cat.id)}
            className={`px-3 py-1.5 text-sm rounded-full transition-colors ${
              category === cat.id
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkillCardSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg mb-4">{error}</p>
          <button
            onClick={fetchSkills}
            className="px-5 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            重新加载
          </button>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">🔍</div>
          <p className="text-gray-400 text-lg mb-2">暂无相关内容</p>
          <p className="text-gray-300 text-sm mb-4">当前筛选条件下没有找到 Skill</p>
          <button
            onClick={() => {
              setCategory('all');
              setSort('hot');
            }}
            className="px-5 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            清除筛选
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {skills.map((skill, index) => (
              <div
                key={skill.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <SkillCard skill={skill} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                上一页
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-9 h-9 text-sm rounded-lg transition-colors ${
                    p === page
                      ? 'bg-gray-900 text-white'
                      : 'border border-gray-200 hover:bg-gray-50 text-gray-600'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
