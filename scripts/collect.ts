import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { translateToChinese, isMostlyEnglish } from '../src/lib/translate';
import { classifySkill } from '../src/lib/classify';

const dbUrl = process.env.DATABASE_URL ?? `file:${path.resolve(process.cwd(), 'prisma/dev.db')}`;
process.env.DATABASE_URL = dbUrl;

const prisma = new PrismaClient();

interface GitHubFileResult {
  name: string;
  path: string;
  repository: {
    full_name: string;
    html_url: string;
    stargazers_count: number;
    description: string | null;
    owner: { login: string };
    pushed_at: string;
  };
}

interface RawSkill {
  name: string;
  summaryCn: string;
  description: string | null;
  category: string;
  sourceUrl: string;
  sourceType: string;
  platform: string;
  author: string;
  stars: number;
  sourceUpdatedAt: string | undefined;
  rawContent?: string;
}

/**
 * 从 GitHub 搜索 API 获取包含 SKILL.md 的仓库
 */
async function searchGitHubSkills(
  query: string,
  perPage = 30,
  page = 1
): Promise<GitHubFileResult[]> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const q = encodeURIComponent(query);
  const url = `https://api.github.com/search/code?q=${q}&per_page=${perPage}&page=${page}`;

  const resp = await fetch(url, { headers });
  if (!resp.ok) {
    throw new Error(`GitHub API error: ${resp.status} ${resp.statusText}`);
  }
  const data = await resp.json();
  return data.items ?? [];
}

/**
 * 获取 SKILL.md 的原始内容
 */
async function fetchSkillContent(rawUrl: string): Promise<string | null> {
  try {
    const resp = await fetch(rawUrl, {
      headers: { Accept: 'application/vnd.github.raw+json' },
    });
    if (!resp.ok) return null;
    const text = await resp.text();
    return text.slice(0, 3000); // 截断，避免过长
  } catch {
    return null;
  }
}

/**
 * 从 SKILL.md 内容中提取 description 字段
 */
function extractDescription(content: string): string | null {
  const match = content.match(/(?:^|\n)#{1,3}\s*description\s*\n+([\s\S]*?)(?:\n#{1,3}\s|$)/i);
  if (match) {
    return match[1].trim().slice(0, 1000);
  }
  // 尝试找 name 之后的描述
  const lines = content.split('\n').filter((l) => l.trim() && !l.startsWith('#'));
  return lines[0]?.trim()?.slice(0, 1000) ?? null;
}

/**
 * 从 SKILL.md 内容推断适用平台
 */
function detectPlatform(content: string, repoName: string): string {
  const text = `${content} ${repoName}`.toLowerCase();
  const platforms: string[] = [];
  if (text.includes('claude')) platforms.push('Claude Code');
  if (text.includes('codex')) platforms.push('Codex');
  if (text.includes('cursor')) platforms.push('Cursor');
  if (text.includes('copilot')) platforms.push('GitHub Copilot');
  return platforms.length > 0 ? JSON.stringify(platforms) : JSON.stringify(['通用']);
}

async function getExistingUrls(): Promise<Set<string>> {
  const skills = await prisma.skill.findMany({ select: { sourceUrl: true } });
  return new Set(skills.map((s) => s.sourceUrl));
}

async function collect() {
  console.log('🤖 开始采集 AI Skill...');

  const queries = [
    'filename:SKILL.md path:/',           // 根目录 SKILL.md
    'filename:SKILL.md extension:md stars:>5',
    'SKILL.md in:path agent skills',
  ];

  const existingUrls = await getExistingUrls();
  const collected: RawSkill[] = [];
  let newCount = 0;
  let updateCount = 0;
  let errorCount = 0;

  for (const query of queries) {
    try {
      const results = await searchGitHubSkills(query, 30, 1);

      for (const item of results) {
        const sourceUrl = `https://github.com/${item.repository.full_name}`;
        if (existingUrls.has(sourceUrl)) {
          updateCount++;
          continue;
        }

        // 质量过滤
        if (item.repository.stargazers_count < 3) continue;

        const content = await fetchSkillContent(item.repository.html_url);
        const description = content
          ? extractDescription(content)
          : item.repository.description;

        if (!description || description.length < 20) continue;

        const category = classifySkill(item.name, description);

        // 翻译
        let summaryCn = description;
        if (isMostlyEnglish(description)) {
          const translated = await translateToChinese(description);
          if (translated) summaryCn = translated;
        }

        const platform = detectPlatform(content ?? '', item.repository.full_name);

        collected.push({
          name: item.name.replace(/\.md$/i, '').replace(/SKILL/i, '').trim() || item.repository.full_name.split('/').pop()!,
          summaryCn: summaryCn.slice(0, 200),
          description: description.slice(0, 2000),
          category,
          sourceUrl,
          sourceType: 'github',
          platform,
          author: item.repository.owner.login,
          stars: item.repository.stargazers_count,
          sourceUpdatedAt: item.repository.pushed_at ? item.repository.pushed_at.slice(0, 10) : undefined,
        });

        newCount++;
        existingUrls.add(sourceUrl);
      }
    } catch (err) {
      errorCount++;
      console.error(`  ⚠️ 查询 "${query}" 失败:`, (err as Error).message);
    }
  }

  // 入库
  for (const skill of collected) {
    try {
      await prisma.skill.create({
        data: {
          ...skill,
          tags: '[]',
          isNew: 1,
          status: 'published',
        },
      });
    } catch (err) {
      errorCount++;
      console.error(`  ⚠️ 入库失败 ${skill.name}:`, (err as Error).message);
    }
  }

  // 记录采集日志
  const status = errorCount > 0 ? 'partial' : 'success';
  await prisma.collectLog.create({
    data: {
      sourceName: 'github-search',
      status,
      newCount,
      updateCount,
      errorMsg: errorCount > 0 ? `${errorCount} errors` : null,
    },
  });

  console.log(`✅ 采集完成: 新增 ${newCount} 个, 已存在 ${updateCount} 个, 错误 ${errorCount} 个`);
  console.log(`📊 数据库共有 ${await prisma.skill.count()} 个 Skill`);
}

collect()
  .catch((e) => {
    console.error('❌ 采集失败:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
