/*
  Warnings:

  - The values [PDF,EXCEL] on the enum `ImportSource` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ImportSource_new" AS ENUM ('MANUAL', 'JSON', 'CSV');
ALTER TABLE "public"."Transaction" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "Transaction" ALTER COLUMN "source" TYPE "ImportSource_new" USING ("source"::text::"ImportSource_new");
ALTER TYPE "ImportSource" RENAME TO "ImportSource_old";
ALTER TYPE "ImportSource_new" RENAME TO "ImportSource";
DROP TYPE "public"."ImportSource_old";
ALTER TABLE "Transaction" ALTER COLUMN "source" SET DEFAULT 'MANUAL';
COMMIT;
