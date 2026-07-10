'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getCategoryLabel } from '@/shared/categories';

interface Skill {
  id: string;
  name: string;
  summaryCn: string;
  category: string;
  sourceUrl: string;
  sourceType: string;
  author: string | null;
  status: string;
  createdAt: string;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoginError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setAuthenticated(true);
        localStorage.setItem('admin_token', password);
      } else {
        setLoginError('密码错误');
      }
    } catch {
      setLoginError('登录失败');
    }
  };

  const fetchPending = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token') ?? password;
    try {
      const res = await fetch('/api/admin/skills', {
        headers: { 'x-admin-token': token },
      });
      if (res.ok) {
        const data = await res.json();
        setSkills(data.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: string, action: 'approve' | 'reject') => {
    const token = localStorage.getItem('admin_token') ?? password;
    try {
      await fetch(`/api/admin/skills/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify({ action }),
      });
      fetchPending();
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    if (authenticated) fetchPending();
  }, [authenticated]);

  // Auto-restore session
  useEffect(() => {
    const saved = localStorage.getItem('admin_token');
    if (saved) {
      setPassword(saved);
      setAuthenticated(true);
    }
  }, []);

  if (!authenticated) {
    return (
      <div className="max-w-sm mx-auto px-4 py-20">
        <h1 className="text-xl font-bold text-gray-900 mb-6 text-center">管理员登录</h1>
        <div className="space-y-3">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="请输入管理员密码"
          />
          {loginError && <p className="text-sm text-red-500">{loginError}</p>}
          <Button onClick={handleLogin} className="w-full">
            登录
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">审核管理</h1>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{skills.length} 条待审核</Badge>
          <Button variant="outline" size="sm" onClick={fetchPending} disabled={loading}>
            {loading ? '刷新中...' : '刷新'}
          </Button>
        </div>
      </div>

      {skills.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">✅</div>
          <p>暂无待审核的 Skill</p>
        </div>
      ) : (
        <div className="space-y-3">
          {skills.map((skill) => (
            <Card key={skill.id} className="border-gray-100">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1">{skill.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{skill.summaryCn}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                        {getCategoryLabel(skill.category)}
                      </Badge>
                      <span>{skill.sourceType}</span>
                      {skill.author && <span>by {skill.author}</span>}
                      <a
                        href={skill.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline truncate"
                      >
                        查看来源
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => handleReview(skill.id, 'reject')}
                    >
                      驳回
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleReview(skill.id, 'approve')}
                    >
                      通过
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
