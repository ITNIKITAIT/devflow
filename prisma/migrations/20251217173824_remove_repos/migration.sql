/*
  Warnings:

  - You are about to drop the `Authenticator` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repositories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `repository_settings` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userId` to the `analyses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Authenticator" DROP CONSTRAINT "Authenticator_userId_fkey";

-- DropForeignKey
ALTER TABLE "analyses" DROP CONSTRAINT "analyses_repositoryId_fkey";

-- DropForeignKey
ALTER TABLE "repositories" DROP CONSTRAINT "repositories_userId_fkey";

-- DropForeignKey
ALTER TABLE "repository_settings" DROP CONSTRAINT "repository_settings_repositoryId_fkey";

-- DropIndex
DROP INDEX "analyses_repositoryId_idx";

-- AlterTable
ALTER TABLE "analyses" ADD COLUMN     "userId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Authenticator";

-- DropTable
DROP TABLE "VerificationToken";

-- DropTable
DROP TABLE "repositories";

-- DropTable
DROP TABLE "repository_settings";

-- AddForeignKey
ALTER TABLE "analyses" ADD CONSTRAINT "analyses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
