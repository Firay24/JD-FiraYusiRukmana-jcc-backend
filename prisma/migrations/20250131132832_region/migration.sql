/*
  Warnings:

  - You are about to drop the column `RegionId` on the `Competition` table. All the data in the column will be lost.
  - Added the required column `Region` to the `Region` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Competition" DROP CONSTRAINT "Competition_RegionId_fkey";

-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "RegionId",
ADD COLUMN     "regionId" TEXT;

-- AlterTable
ALTER TABLE "Region" ADD COLUMN     "Region" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "Region"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
