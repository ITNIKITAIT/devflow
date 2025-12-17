/*
  Warnings:

  - The values [DEAD_CODE] on the enum `IssueType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "IssueType_new" AS ENUM ('LONG_FUNCTION', 'LONG_PARAMETER_LIST', 'GOD_CLASS', 'MAGIC_NUMBER', 'LARGE_FILE');
ALTER TABLE "issues" ALTER COLUMN "type" TYPE "IssueType_new" USING ("type"::text::"IssueType_new");
ALTER TYPE "IssueType" RENAME TO "IssueType_old";
ALTER TYPE "IssueType_new" RENAME TO "IssueType";
DROP TYPE "public"."IssueType_old";
COMMIT;
