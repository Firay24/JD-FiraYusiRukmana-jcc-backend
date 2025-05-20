import { PrismaClient as OldClient } from '../prisma/old-client';
import { PrismaClient as NewClient } from '../prisma/new-client';

const oldDb = new OldClient();
const newDb = new NewClient();

async function migrate() {
  // const users = await oldDb.user.findMany();
  // const roles = await oldDb.role.findMany();
  // const subjects = await oldDb.subject.findMany();
  // const seasons = await oldDb.season.findMany();
  // const regions = await oldDb.region.findMany();
  // const competitions = await oldDb.competition.findMany();
  // const schools = await oldDb.school.findMany();
  // const payments = await oldDb.payment.findMany();
  // const paymentHistories = await oldDb.paymentStatusHistory.findMany();
  // const students = await oldDb.student.findMany();
  const competitionParticipants = await oldDb.competitionParticipant.findMany();
  for (const competitionParticipant of competitionParticipants) {
    await newDb.competitionParticipant.create({
      data: {
        Id: competitionParticipant.Id,
        ParticipantId: competitionParticipant.ParticipantId,
        StudentId: competitionParticipant.StudentId,
        CompetitionId: competitionParticipant.CompetitionId,
        PaymentId: competitionParticipant.PaymentId,
        Attedance: competitionParticipant.Attedance,
        Score: competitionParticipant.Score,
        Correct: competitionParticipant.Correct,
        Incorrect: competitionParticipant.Incorrect,
        PathAnswer: competitionParticipant.PathAnswer,
        DateCreate: competitionParticipant.DateCreate,
        DateUpdate: competitionParticipant.DateUpdate,
      },
    });
  }
  // for (const student of students) {
  //   await newDb.student.create({
  //     data: {
  //       Id: student.Id,
  //       IdMember: student.IdMember,
  //       Address: student.Address,
  //       Stage: student.Stage,
  //       Class: student.Class,
  //       NIK: student.NIK,
  //       SchoolId: student.SchoolId,
  //       FatherName: student.FatherName,
  //       MotherName: student.MotherName,
  //       IdUser: student.IdUser,
  //       DateCreate: student.DateCreate,
  //       DateUpdate: student.DateUpdate,
  //     },
  //   });
  // }
  // for (const paymentHistory of paymentHistories) {
  //   await newDb.paymentStatusHistory.create({
  //     data: {
  //       Id: paymentHistory.Id,
  //       PaymentId: paymentHistory.PaymentId,
  //       Status: paymentHistory.Status,
  //       Date: paymentHistory.Date,
  //       DateCreate: paymentHistory.DateCreate,
  //       DateUpdate: paymentHistory.DateUpdate,
  //     },
  //   });
  // }
  // for (const payment of payments) {
  //   await newDb.payment.create({
  //     data: {
  //       Id: payment.Id,
  //       Invoice: payment.Invoice,
  //       Date: payment.Date,
  //       Amount: payment.Amount,
  //       Status: payment.Status,
  //       UserId: payment.UserId,
  //       DateCreate: payment.DateCreate,
  //       DateUpdate: payment.DateUpdate,
  //     },
  //   });
  // }
  // for (const school of schools) {
  //   await newDb.school.create({
  //     data: {
  //       Id: school.Id,
  //       Name: school.Name,
  //       Stage: school.Stage,
  //       Subdistrict: school.Subdistrict,
  //       Ward: school.Ward,
  //       Status: school.Status,
  //       DateCreate: school.DateCreate,
  //       DateUpdate: school.DateUpdate,
  //     },
  //   });
  // }
  // for (const competition of competitions) {
  //   await newDb.competition.create({
  //     data: {
  //       Id: competition.Id,
  //       Name: competition.Name,
  //       Description: competition.Description,
  //       Date: competition.Date,
  //       Level: competition.Level,
  //       Stage: competition.Stage,
  //       Price: competition.Price,
  //       Location: competition.Location,
  //       SeasonId: competition.SeasonId,
  //       RegionId: competition.RegionId,
  //       SubjectId: competition.SubjectId,
  //       DateCreate: competition.DateCreate,
  //       DateUpdate: competition.DateUpdate,
  //     },
  //   });
  // }
  // for (const subject of subjects) {
  //   await newDb.subject.create({
  //     data: {
  //       Id: subject.Id,
  //       Name: subject.Name,
  //       DateCreate: subject.DateCreate,
  //       DateUpdate: subject.DateUpdate,
  //     },
  //   });
  // }
  // for (const season of seasons) {
  //   await newDb.season.create({
  //     data: {
  //       Id: season.Id,
  //       Name: season.Name,
  //       DateCreate: season.DateCreate,
  //       DateUpdate: season.DateUpdate,
  //       StartDate: season.StartDate,
  //       EndDate: season.EndDate,
  //     },
  //   });
  // }
  // for (const region of regions) {
  //   await newDb.region.create({
  //     data: {
  //       Id: region.Id,
  //       Name: region.Name,
  //       Region: region.Region,
  //       RegionDetail: region.RegionDetail,
  //       DateCreate: region.DateCreate,
  //       DateUpdate: region.DateUpdate,
  //     },
  //   });
  // }
  // for (const role of roles) {
  //   await newDb.role.create({
  //     data: {
  //       Id: role.Id,
  //       Name: role.Name,
  //       DateCreate: role.DateCreate,
  //       DateUpdate: role.DateUpdate,
  //     },
  //   });
  // }
  // for (const user of users) {
  //   await newDb.user.create({
  //     data: {
  //       Id: user.Id,
  //       Name: user.Name,
  //       Username: user.Username,
  //       Password: user.Password,
  //       RoleId: user.RoleId,
  //       BirthPlace: user.BirthPlace,
  //       Birthdate: user.Birthdate,
  //       PhoneNumber: user.PhoneNumber,
  //       Gender: user.Gender,
  //       Email: user.Email,
  //       Status: user.Status,
  //       DateCreate: user.DateCreate,
  //       DateUpdate: user.DateUpdate,
  //     },
  //   });
  // }
}

migrate()
  .catch((err) => {
    console.error('❌ Migrasi gagal:', err);
  })
  .finally(async () => {
    await oldDb.$disconnect();
    await newDb.$disconnect();
  });
