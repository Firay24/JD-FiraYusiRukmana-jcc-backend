-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "IdMember" TEXT,
ALTER COLUMN "FatherName" DROP NOT NULL,
ALTER COLUMN "MotherName" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "BirthPlace" TEXT;
