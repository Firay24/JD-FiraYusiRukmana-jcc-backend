-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('SUPERADMIN', 'ADMIN', 'EVENTADMIN', 'PARTICIPANT', 'FACILITATOR');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('PENDING', 'CONFIRMED', 'COMPLETED');

-- CreateTable
CREATE TABLE "Role" (
    "Id" TEXT NOT NULL,
    "Name" "RoleType" NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "User" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Name" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "RoleId" TEXT NOT NULL,
    "Birthdate" TIMESTAMP(3) NOT NULL,
    "PhoneNumber" TEXT NOT NULL,
    "Gender" BOOLEAN NOT NULL,
    "Email" TEXT,
    "Status" "ActiveStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "User_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Student" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Address" TEXT NOT NULL,
    "Class" TEXT NOT NULL,
    "NIK" TEXT NOT NULL,
    "FatherName" TEXT NOT NULL,
    "MotherName" TEXT NOT NULL,
    "IdUser" TEXT NOT NULL,
    "PhotoPath" TEXT NOT NULL,
    "Birthdate" TIMESTAMP(3) NOT NULL,
    "UserId" TEXT,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Season" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Name" TEXT NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Competition" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Name" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Level" INTEGER NOT NULL,
    "Stage" TEXT NOT NULL,
    "Price" INTEGER NOT NULL,
    "SeasonId" TEXT NOT NULL,
    "SubjectId" TEXT NOT NULL,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Exam" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "CompetitionId" TEXT NOT NULL,
    "Correct" INTEGER NOT NULL,
    "Incorrect" INTEGER NOT NULL,
    "Score" INTEGER NOT NULL,
    "QuestionCode" TEXT NOT NULL,

    CONSTRAINT "Exam_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Region" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Name" TEXT NOT NULL,
    "RegionDetail" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Supervisor" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Name" TEXT NOT NULL,
    "Birthdate" TIMESTAMP(3) NOT NULL,
    "PhoneNumber" TEXT NOT NULL,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CompetitionRoom" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Name" TEXT NOT NULL,
    "CompetitionId" TEXT NOT NULL,
    "SupervisorId" TEXT NOT NULL,
    "userId" TEXT,

    CONSTRAINT "CompetitionRoom_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CompetitionParticipant" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "StudentId" TEXT NOT NULL,
    "CompetitionId" TEXT NOT NULL,
    "CompetitionRoomId" TEXT,
    "PaymentId" TEXT,
    "Attedance" BOOLEAN NOT NULL,
    "Score" INTEGER NOT NULL,

    CONSTRAINT "CompetitionParticipant_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Kisi" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Content" TEXT NOT NULL,
    "CompetitionId" TEXT NOT NULL,

    CONSTRAINT "Kisi_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Tryout" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Name" TEXT NOT NULL,
    "CompetitionId" TEXT NOT NULL,

    CONSTRAINT "Tryout_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Question" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "TryoutId" TEXT NOT NULL,
    "Content" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Option" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Answer" TEXT NOT NULL,
    "IsCorrect" BOOLEAN NOT NULL,
    "QuestionId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Discussion" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Name" TEXT NOT NULL,
    "CompetitionId" TEXT NOT NULL,

    CONSTRAINT "Discussion_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Invoice" TEXT NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "Amount" INTEGER NOT NULL,
    "Status" "PaymentType" NOT NULL,
    "UserId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "News" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "CreatedBy" TEXT,
    "UpdatedBy" TEXT,
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "Role"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Season" ADD CONSTRAINT "Season_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subject" ADD CONSTRAINT "Subject_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_SeasonId_fkey" FOREIGN KEY ("SeasonId") REFERENCES "Season"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_SubjectId_fkey" FOREIGN KEY ("SubjectId") REFERENCES "Subject"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Exam" ADD CONSTRAINT "Exam_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Region" ADD CONSTRAINT "Region_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisor" ADD CONSTRAINT "Supervisor_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Supervisor" ADD CONSTRAINT "Supervisor_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRoom" ADD CONSTRAINT "CompetitionRoom_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRoom" ADD CONSTRAINT "CompetitionRoom_SupervisorId_fkey" FOREIGN KEY ("SupervisorId") REFERENCES "Supervisor"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRoom" ADD CONSTRAINT "CompetitionRoom_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRoom" ADD CONSTRAINT "CompetitionRoom_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRoom" ADD CONSTRAINT "CompetitionRoom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Student"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_CompetitionRoomId_fkey" FOREIGN KEY ("CompetitionRoomId") REFERENCES "CompetitionRoom"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kisi" ADD CONSTRAINT "Kisi_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kisi" ADD CONSTRAINT "Kisi_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kisi" ADD CONSTRAINT "Kisi_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tryout" ADD CONSTRAINT "Tryout_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tryout" ADD CONSTRAINT "Tryout_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tryout" ADD CONSTRAINT "Tryout_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_TryoutId_fkey" FOREIGN KEY ("TryoutId") REFERENCES "Tryout"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_QuestionId_fkey" FOREIGN KEY ("QuestionId") REFERENCES "Question"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Discussion" ADD CONSTRAINT "Discussion_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_CreatedBy_fkey" FOREIGN KEY ("CreatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_UpdatedBy_fkey" FOREIGN KEY ("UpdatedBy") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;
