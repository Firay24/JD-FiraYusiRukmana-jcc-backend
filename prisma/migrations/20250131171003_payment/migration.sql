-- CreateTable
CREATE TABLE "PaymentStatusHistory" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "PaymentId" TEXT NOT NULL,
    "Status" "PaymentType" NOT NULL,
    "Date" INTEGER NOT NULL,

    CONSTRAINT "PaymentStatusHistory_pkey" PRIMARY KEY ("Id")
);

-- AddForeignKey
ALTER TABLE "PaymentStatusHistory" ADD CONSTRAINT "PaymentStatusHistory_PaymentId_fkey" FOREIGN KEY ("PaymentId") REFERENCES "Payment"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
