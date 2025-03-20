-- DropForeignKey
ALTER TABLE "CompetitionRoom" DROP CONSTRAINT "CompetitionRoom_SupervisorId_fkey";

-- AlterTable
ALTER TABLE "CompetitionRoom" ALTER COLUMN "SupervisorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CompetitionRoom" ADD CONSTRAINT "CompetitionRoom_SupervisorId_fkey" FOREIGN KEY ("SupervisorId") REFERENCES "Supervisor"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
