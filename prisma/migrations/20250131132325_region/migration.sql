-- AlterTable
ALTER TABLE "Competition" ADD COLUMN     "RegionId" TEXT NOT NULL DEFAULT 'uuid';

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_RegionId_fkey" FOREIGN KEY ("RegionId") REFERENCES "Region"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
