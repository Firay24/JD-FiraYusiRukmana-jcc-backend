-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_UserId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "UserId" DROP NOT NULL,
ALTER COLUMN "UserId" SET DEFAULT 'ae7317bda7b54cbc8262';

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
