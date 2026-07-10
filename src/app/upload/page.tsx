'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CATEGORIES } from '@/shared/categories';

const PLATFORMS = ['Claude Code', 'Codex', 'Cursor', 'GitHub Copilot', '通用'];

export default function UploadPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState({
    name: '',
    summaryCn: '',
    description: '',
    category: '',
    sourceUrl: '',
    platform: ['通用'],
    installCmd: '',
    author: '',
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const handlePlatformToggle = (platform: string) => {
    setForm((prev) => {
      const current = prev.platform;
      if (current.includes(platform)) {
        const next = current.filter((p) => p !== platform);
        return { ...prev, platform: next.length === 0 ? ['通用'] : next };
      } else {
        const next = current.filter((p) => p !== '通用').concat(platform);
        return { ...prev, platform: next };
      }
    });
  };

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = 'Skill 名称不能为空';
    if (!form.summaryCn.trim()) errors.summaryCn = '中文简介不能为空';
    if (form.summaryCn.trim().length < 10)
      errors.summaryCn = '中文简介至少 10 个字';
    if (form.summaryCn.trim().length > 500)
      errors.summaryCn = '中文简介不能超过 500 字';
    if (!form.category) errors.category = '请选择分类';
    if (!form.sourceUrl.trim()) errors.sourceUrl = '来源链接不能为空';
    try {
      new URL(form.sourceUrl);
    } catch {
      errors.sourceUrl = '请输入有效的 URL';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? '提交失败，请稍后重试');
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch {
      setError('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">提交成功！</h1>
        <p className="text-gray-400 mb-4">你的 Skill 已提交，审核通过后将在首页展示</p>
        <p className="text-sm text-gray-300">即将跳转回首页...</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">上传 Skill</h1>
        <p className="text-gray-500 text-sm">分享你发现或创建的 AI Skill，审核通过后将在首页展示</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="border-gray-100">
          <CardContent className="p-6 space-y-5">
            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name">
                Skill 名称 <span className="text-red-400">*</span>
              </Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="保留原始语言，如 frontend-design"
              />
              {fieldErrors.name && (
                <p className="text-sm text-red-500">{fieldErrors.name}</p>
              )}
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <Label htmlFor="summaryCn">
                中文简介 <span className="text-red-400">*</span>
              </Label>
              <Textarea
                id="summaryCn"
                value={form.summaryCn}
                onChange={(e) => handleChange('summaryCn', e.target.value)}
                placeholder="用中文简要描述这个 Skill 的功能和用途（10-500 字）"
                rows={3}
              />
              {fieldErrors.summaryCn && (
                <p className="text-sm text-red-500">{fieldErrors.summaryCn}</p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <Label htmlFor="description">原始描述</Label>
              <Textarea
                id="description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Skill 的原始语言完整描述（可选）"
                rows={4}
              />
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <Label>
                分类 <span className="text-red-400">*</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleChange('category', cat.id)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      form.category === cat.id
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
              {fieldErrors.category && (
                <p className="text-sm text-red-500">{fieldErrors.category}</p>
              )}
            </div>

            {/* Platform */}
            <div className="space-y-1.5">
              <Label>适用平台</Label>
              <div className="flex flex-wrap gap-2">
                {PLATFORMS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePlatformToggle(p)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                      form.platform.includes(p)
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Source URL */}
            <div className="space-y-1.5">
              <Label htmlFor="sourceUrl">
                来源链接 <span className="text-red-400">*</span>
              </Label>
              <Input
                id="sourceUrl"
                value={form.sourceUrl}
                onChange={(e) => handleChange('sourceUrl', e.target.value)}
                placeholder="https://github.com/xxx/xxx"
              />
              {fieldErrors.sourceUrl && (
                <p className="text-sm text-red-500">{fieldErrors.sourceUrl}</p>
              )}
            </div>

            {/* Install Command */}
            <div className="space-y-1.5">
              <Label htmlFor="installCmd">安装方式</Label>
              <Input
                id="installCmd"
                value={form.installCmd}
                onChange={(e) => handleChange('installCmd', e.target.value)}
                placeholder="如：claude skills install xxx"
              />
            </div>

            {/* Author */}
            <div className="space-y-1.5">
              <Label htmlFor="author">作者名称</Label>
              <Input
                id="author"
                value={form.author}
                onChange={(e) => handleChange('author', e.target.value)}
                placeholder="Skill 原作者（可选）"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? '提交中...' : '提交审核'}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
