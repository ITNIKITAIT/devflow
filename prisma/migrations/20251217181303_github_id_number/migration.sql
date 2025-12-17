/*
  Warnings:

  - Changed the type of `repositoryId` on the `analyses` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "analyses" DROP COLUMN "repositoryId",
ADD COLUMN     "repositoryId" INTEGER NOT NULL;
