/*
  Warnings:

  - Added the required column `ParticipantId` to the `CompetitionParticipant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CompetitionParticipant" ADD COLUMN     "ParticipantId" TEXT NOT NULL;
