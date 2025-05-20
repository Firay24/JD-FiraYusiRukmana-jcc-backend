-- CreateEnum
CREATE TYPE "StageType" AS ENUM ('TK', 'SD', 'SMP', 'LEMBAGA');

-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "StatusSchool" AS ENUM ('SWASTA', 'NEGERI');

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
    "Name" TEXT NOT NULL,
    "Username" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "RoleId" TEXT NOT NULL,
    "Birthdate" INTEGER NOT NULL,
    "BirthPlace" TEXT,
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
    "IdMember" TEXT,
    "Address" TEXT NOT NULL,
    "Stage" "StageType" NOT NULL,
    "Class" TEXT NOT NULL,
    "SchoolId" TEXT NOT NULL,
    "NIK" TEXT NOT NULL,
    "FatherName" TEXT,
    "MotherName" TEXT,
    "IdUser" TEXT NOT NULL,
    "PhotoPath" TEXT,
    "Poin" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "StudentId" TEXT NOT NULL,
    "Category" TEXT NOT NULL,
    "Describe" TEXT,
    "SertifNumber" INTEGER,
    "Note" TEXT,
    "CompetitionId" TEXT NOT NULL,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Season" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Name" TEXT NOT NULL,
    "StartDate" INTEGER NOT NULL,
    "EndDate" INTEGER NOT NULL,

    CONSTRAINT "Season_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Subject" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Name" TEXT NOT NULL,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Competition" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Date" INTEGER NOT NULL,
    "Level" INTEGER NOT NULL,
    "Stage" "StageType" NOT NULL,
    "Price" INTEGER NOT NULL,
    "Location" TEXT NOT NULL,
    "SeasonId" TEXT NOT NULL,
    "RegionId" TEXT,
    "SubjectId" TEXT NOT NULL,
    "CodePackage" TEXT,
    "PathAnswer" TEXT,
    "regionId" TEXT,

    CONSTRAINT "Competition_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,
    "Status" BOOLEAN NOT NULL DEFAULT true,
    "PaymentId" TEXT NOT NULL,
    "StudentId" TEXT NOT NULL,
    "CompetitionId" TEXT,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Region" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Region" INTEGER NOT NULL,
    "Name" TEXT NOT NULL,
    "RegionDetail" TEXT NOT NULL,

    CONSTRAINT "Region_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Supervisor" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Name" TEXT NOT NULL,
    "Birthdate" INTEGER NOT NULL,
    "PhoneNumber" TEXT NOT NULL,

    CONSTRAINT "Supervisor_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Room" (
    "Id" TEXT NOT NULL,
    "Name" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),

    CONSTRAINT "Room_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CompetitionRoom" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "RoomId" TEXT NOT NULL,
    "CompetitionId" TEXT NOT NULL,
    "SupervisorId" TEXT,

    CONSTRAINT "CompetitionRoom_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "CompetitionParticipant" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "ParticipantId" TEXT,
    "SertifNumber" INTEGER,
    "StudentId" TEXT NOT NULL,
    "CompetitionId" TEXT NOT NULL,
    "CompetitionRoomId" TEXT,
    "PaymentId" TEXT,
    "Attedance" BOOLEAN,
    "Score" INTEGER,
    "Correct" INTEGER,
    "Incorrect" INTEGER,
    "PathAnswer" TEXT,

    CONSTRAINT "CompetitionParticipant_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Kisi" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Header" TEXT,
    "Content" TEXT NOT NULL,
    "CompetitionId" TEXT NOT NULL,

    CONSTRAINT "Kisi_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Tryout" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Name" TEXT NOT NULL,
    "CompetitionId" TEXT NOT NULL,

    CONSTRAINT "Tryout_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Question" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "TryoutId" TEXT NOT NULL,
    "Content" TEXT NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Option" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Answer" TEXT NOT NULL,
    "IsCorrect" BOOLEAN NOT NULL,
    "QuestionId" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Invoice" TEXT NOT NULL,
    "Date" INTEGER NOT NULL,
    "Amount" INTEGER NOT NULL,
    "PathTransaction" TEXT,
    "UserId" TEXT DEFAULT 'ae7317bda7b54cbc8262',
    "Status" "PaymentType" NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("Id")
);

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

-- CreateTable
CREATE TABLE "School" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Name" TEXT NOT NULL,
    "Stage" "StageType" NOT NULL,
    "Subdistrict" TEXT NOT NULL,
    "Ward" TEXT NOT NULL,
    "Status" "StatusSchool" NOT NULL,

    CONSTRAINT "School_pkey" PRIMARY KEY ("Id")
);

-- CreateTable
CREATE TABLE "News" (
    "Id" TEXT NOT NULL,
    "DateCreate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "DateUpdate" TIMESTAMP(3),
    "Title" TEXT NOT NULL,
    "Description" TEXT NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("Id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_RoleId_fkey" FOREIGN KEY ("RoleId") REFERENCES "Role"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_IdUser_fkey" FOREIGN KEY ("IdUser") REFERENCES "User"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_SchoolId_fkey" FOREIGN KEY ("SchoolId") REFERENCES "School"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Student"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_RegionId_fkey" FOREIGN KEY ("RegionId") REFERENCES "Region"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_SeasonId_fkey" FOREIGN KEY ("SeasonId") REFERENCES "Season"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Competition" ADD CONSTRAINT "Competition_SubjectId_fkey" FOREIGN KEY ("SubjectId") REFERENCES "Subject"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Student"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_PaymentId_fkey" FOREIGN KEY ("PaymentId") REFERENCES "Payment"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRoom" ADD CONSTRAINT "CompetitionRoom_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRoom" ADD CONSTRAINT "CompetitionRoom_SupervisorId_fkey" FOREIGN KEY ("SupervisorId") REFERENCES "Supervisor"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionRoom" ADD CONSTRAINT "CompetitionRoom_RoomId_fkey" FOREIGN KEY ("RoomId") REFERENCES "Room"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_CompetitionRoomId_fkey" FOREIGN KEY ("CompetitionRoomId") REFERENCES "CompetitionRoom"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_PaymentId_fkey" FOREIGN KEY ("PaymentId") REFERENCES "Payment"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompetitionParticipant" ADD CONSTRAINT "CompetitionParticipant_StudentId_fkey" FOREIGN KEY ("StudentId") REFERENCES "Student"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Kisi" ADD CONSTRAINT "Kisi_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tryout" ADD CONSTRAINT "Tryout_CompetitionId_fkey" FOREIGN KEY ("CompetitionId") REFERENCES "Competition"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_TryoutId_fkey" FOREIGN KEY ("TryoutId") REFERENCES "Tryout"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_QuestionId_fkey" FOREIGN KEY ("QuestionId") REFERENCES "Question"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "User"("Id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentStatusHistory" ADD CONSTRAINT "PaymentStatusHistory_PaymentId_fkey" FOREIGN KEY ("PaymentId") REFERENCES "Payment"("Id") ON DELETE RESTRICT ON UPDATE CASCADE;
