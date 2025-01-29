/*
  Warnings:

  - You are about to drop the column `Poin` on the `CompetitionParticipant` table. All the data in the column will be lost.
  - Changed the type of `Stage` on the `Competition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "Stage",
ADD COLUMN     "Stage" "StageType" NOT NULL;

-- AlterTable
ALTER TABLE "CompetitionParticipant" DROP COLUMN "Poin";

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "Poin" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Achievement" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "UserId" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Describe" TEXT,
    "CompetitionId" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
