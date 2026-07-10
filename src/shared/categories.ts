export const CATEGORIES = [
  { id: 'development', label: '开发工具', icon: '💻' },
  { id: 'data-ai', label: '数据与AI', icon: '🧠' },
  { id: 'content-media', label: '内容创作', icon: '✍️' },
  { id: 'design-creative', label: '设计创意', icon: '🎨' },
  { id: 'office-productivity', label: '办公效率', icon: '📋' },
  { id: 'testing-security', label: '测试与安全', icon: '🛡️' },
  { id: 'business', label: '商业运营', icon: '📈' },
  { id: 'other', label: '其他', icon: '📦' },
] as const;

export type CategoryId = (typeof CATEGORIES)[number]['id'];

export function getCategoryLabel(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.label ?? id;
}

export function getCategoryIcon(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.icon ?? '📦';
}
