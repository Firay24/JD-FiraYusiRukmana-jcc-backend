/*
  Warnings:

  - The values [MUNCAAR] on the enum `Subdistrict` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Subdistrict_new" AS ENUM ('PESANGGARAN', 'SILIRAGUNG', 'BANGOREJO', 'PURWOHARJO', 'TEGALDLIMO', 'MUNCAR', 'CLURING', 'GAMBIRAN', 'TEGALSARI', 'GLENMORE', 'KALIBARU', 'GENTENG', 'SRONO', 'ROGOJAMPI', 'BLIMBINGSARI', 'KABAT', 'SINGOJURUH', 'SEMPU', 'SONGGON', 'GLAGAH', 'LICIN', 'BANYUWANGI', 'GIRI', 'KALIPURO', 'WONGSOREJO');
ALTER TABLE "School" ALTER COLUMN "Subdistrict" TYPE "Subdistrict_new" USING ("Subdistrict"::text::"Subdistrict_new");
ALTER TYPE "Subdistrict" RENAME TO "Subdistrict_old";
ALTER TYPE "Subdistrict_new" RENAME TO "Subdistrict";
DROP TYPE "Subdistrict_old";
COMMIT;
