import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * 判断文本是否主要为英文
 */
export function isMostlyEnglish(text: string): boolean {
  if (!text || text.trim().length === 0) return false;
  const latinChars = (text.match(/[a-zA-Z]/g) || []).length;
  const cjkChars = (text.match(/[一-鿿]/g) || []).length;
  if (latinChars + cjkChars === 0) return false;
  // 拉丁字母占比超过 50% 视为英文为主
  return latinChars / (latinChars + cjkChars) > 0.5;
}

/**
 * 调用 LLM 翻译 API（OpenAI 兼容）
 * 支持通过环境变量配置：
 *   OPENAI_API_KEY / OPENAI_BASE_URL / OPENAI_MODEL
 */
async function callTranslateAPI(text: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const baseURL = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';
  const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);

    const resp = await fetch(`${baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: 'system',
            content:
              'You are a translator. Translate the following AI Skill description from English to Simplified Chinese. Keep code blocks, commands, and technical terms in original language. Be concise and natural. Output only the Chinese translation.',
          },
          { role: 'user', content: text.slice(0, 2000) },
        ],
        temperature: 0.3,
        max_tokens: 300,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!resp.ok) return null;
    const data = await resp.json();
    const translated = data?.choices?.[0]?.message?.content?.trim();
    return translated || null;
  } catch {
    return null;
  }
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `h${hash}`;
}

/**
 * 翻译文本，带缓存。
 * 若文本不是英文，直接返回原文。
 * 若无 API key 或调用失败，返回 null（调用方决定降级策略）。
 */
export async function translateToChinese(text: string): Promise<string | null> {
  if (!text || !isMostlyEnglish(text)) return text || null;

  const sourceHash = hashString(text.slice(0, 500));

  // 1. 查缓存
  try {
    const cached = await prisma.translationCache.findUnique({
      where: { sourceHash },
    });
    if (cached) return cached.translatedText;
  } catch {
    // ignore cache error
  }

  // 2. 调用 API
  const translated = await callTranslateAPI(text);
  if (!translated) return null;

  // 3. 写缓存
  try {
    await prisma.translationCache.create({
      data: { sourceHash, originalText: text.slice(0, 500), translatedText: translated },
    });
  } catch {
    // ignore cache write error
  }

  return translated;
}
