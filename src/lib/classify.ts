import { CATEGORIES } from '@/shared/categories';

/**
 * 基于关键词的 Skill 自动分类
 * 返回匹配的分类 id；若无匹配则返回 'other'
 */

interface CategoryRule {
  id: string;
  keywords: string[];
}

const RULES: CategoryRule[] = [
  {
    id: 'development',
    keywords: [
      'code', 'coding', 'programming', 'debug', 'refactor', 'typescript', 'javascript',
      'python', 'react', 'next.js', 'vue', 'node', 'api', 'backend', 'frontend development',
      'git', 'test', 'tdd', 'mcp', 'cli', 'sdk', 'library', 'framework', 'build', 'compile',
      '开发', '代码', '编程', '调试', '重构',
    ],
  },
  {
    id: 'data-ai',
    keywords: [
      'data', 'analysis', 'analytics', 'machine learning', 'ml', 'model', 'prompt', 'llm',
      'dataset', 'sql', 'database', 'vector', 'embedding', 'rag', 'nlp', 'training',
      '数据', '分析', '机器学习', '模型', '提示词', '向量',
    ],
  },
  {
    id: 'content-media',
    keywords: [
      'write', 'writing', 'content', 'blog', 'article', 'copywriting', 'translation', 'translate',
      'video', 'audio', 'podcast', 'social media', 'marketing copy', 'gif', 'story',
      '写作', '文案', '翻译', '视频', '音频', '内容',
    ],
  },
  {
    id: 'design-creative',
    keywords: [
      'design', 'ui', 'ux', 'visual', 'css', 'tailwind', 'figma', 'art', 'color', 'typography',
      'layout', 'brand', 'theme', 'creative', 'illustration',
      '设计', '视觉', '排版', '布局', '主题',
    ],
  },
  {
    id: 'office-productivity',
    keywords: [
      'document', 'docx', 'pdf', 'excel', 'xlsx', 'ppt', 'presentation', 'slides', 'spreadsheet',
      'word', 'note', 'email', 'calendar', 'schedule', 'report', 'office',
      '文档', '表格', '演示', '幻灯片', '邮件', '日程',
    ],
  },
  {
    id: 'testing-security',
    keywords: [
      'test', 'testing', 'security', 'vulnerability', 'audit', 'penetration', 'exploit',
      'safe', 'scan', 'cve', 'auth', 'oauth', 'encryption', 'review', 'qa',
      '测试', '安全', '漏洞', '审计', '审查',
    ],
  },
  {
    id: 'business',
    keywords: [
      'business', 'marketing', 'seo', 'sales', 'customer', 'crm', 'strategy', 'product',
      'standup', 'meeting', 'roadmap', 'growth', 'revenue', 'operation',
      '商业', '营销', '销售', '运营', '战略', '产品',
    ],
  },
];

export function classifySkill(name: string, description: string): string {
  const text = `${name} ${description}`.toLowerCase();

  let bestMatch = 'other';
  let bestScore = 0;

  for (const rule of RULES) {
    let score = 0;
    for (const kw of rule.keywords) {
      if (text.includes(kw.toLowerCase())) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = rule.id;
    }
  }

  return bestScore > 0 ? bestMatch : 'other';
}

// 确保 CATEGORIES 被引用（避免 tree-shaking 误删类型）
export const _categories = CATEGORIES;
