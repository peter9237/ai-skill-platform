import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

/**
 * 统一使用 libSQL adapter 连接 SQLite 兼容数据库：
 * - 本地开发: DATABASE_URL=file:./prisma/dev.db
 * - 生产 (Turso): DATABASE_URL=libsql://xxx.turso.io + DATABASE_AUTH_TOKEN
 * 两者代码完全一致，只切换环境变量即可
 */

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db',
  authToken: process.env.DATABASE_AUTH_TOKEN,
});

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
