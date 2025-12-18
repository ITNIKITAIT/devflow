import { createTestPrismaClient } from './db';

let testPrisma: ReturnType<typeof createTestPrismaClient> | null = null;

export function getTestPrisma() {
  if (!testPrisma) {
    testPrisma = createTestPrismaClient();
  }
  return testPrisma;
}

export async function teardownTests() {
  if (testPrisma) {
    await testPrisma.$disconnect();
    testPrisma = null;
  }
}
