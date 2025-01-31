/*
  Warnings:

  - Changed the type of `Date` on the `Competition` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `Date` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `StartDate` on the `Season` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `EndDate` on the `Season` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `Birthdate` on the `Supervisor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `Birthdate` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Competition" DROP COLUMN "Date",
ADD COLUMN     "Date" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "Date",
ADD COLUMN     "Date" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Season" DROP COLUMN "StartDate",
ADD COLUMN     "StartDate" INTEGER NOT NULL,
DROP COLUMN "EndDate",
ADD COLUMN     "EndDate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Supervisor" DROP COLUMN "Birthdate",
ADD COLUMN     "Birthdate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "Birthdate",
ADD COLUMN     "Birthdate" INTEGER NOT NULL;
