import { NextResponse } from 'next/server';
import { CATEGORIES } from '@/shared/categories';

export async function GET() {
  return NextResponse.json({
    data: CATEGORIES.map((c) => ({ id: c.id, label: c.label, icon: c.icon })),
  });
}
