import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

export function createTestPrismaClient(): PrismaClient {
  const testDatabaseUrl = process.env.TEST_DATABASE_URL as string;

  if (!testDatabaseUrl) {
    throw new Error('TEST_DATABASE_URL environment variable is required for integration tests');
  }

  const adapter = new PrismaPg({
    connectionString: testDatabaseUrl,
  });

  return new PrismaClient({
    adapter,
  });
}

export async function cleanupTestDatabase(prisma: PrismaClient) {
  await prisma.issue.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(
  prisma: PrismaClient,
  overrides?: Partial<{ id: string; name: string; email: string }>
) {
  const userId = overrides?.id || 'test-user-id';
  const userEmail = overrides?.email || 'test@example.com';

  return await prisma.user.upsert({
    where: { id: userId },
    update: {
      name: overrides?.name || 'Test User',
      email: userEmail,
    },
    create: {
      id: userId,
      name: overrides?.name || 'Test User',
      email: userEmail,
    },
  });
}
