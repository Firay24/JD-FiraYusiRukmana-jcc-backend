import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
// import * as bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

dayjs.extend(utc);

// function generateId() {
//   let result = '';
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

//   for (let i = 0; i < 10; i++) {
//     const randomIndex = Math.floor(Math.random() * characters.length);
//     result += characters.charAt(randomIndex);
//   }

//   return `${dayjs().unix()}${result}`;
// }
// function hashPassword(password: string): string {
//   const salt = bcryptjs.genSaltSync(10);
//   const hash = bcryptjs.hashSync(password, salt);
//   return hash;
// }

const generateUuid = () => {
  const uuid = uuidv4();
  const noDashes = uuid.replace(/-/g, '');
  return noDashes.slice(0, 20);
};

async function main() {
  // #region Role
  // const roles = [
  //   { Id: generateUuid(), Name: RoleType.SUPERADMIN },
  //   { Id: generateUuid(), Name: RoleType.ADMIN },
  //   { Id: generateUuid(), Name: RoleType.EVENTADMIN },
  //   { Id: generateUuid(), Name: RoleType.FACILITATOR },
  //   { Id: generateUuid(), Name: RoleType.PARTICIPANT },
  // ];
  // await prisma.role.createMany({
  //   skipDuplicates: true,
  //   data: roles,
  // });
  // #endregion
  // #region User
  // await prisma.user.createMany({
  //   skipDuplicates: true,
  //   data: [
  //     {
  //       Id: generateUuid(),
  //       Name: 'Superadmin',
  //       Username: 'superadmin',
  //       Email: 'superadmin@mail.com',
  //       Password: hashPassword('junior12345'),
  //       RoleId: roles.find((a) => a.Name === RoleType.SUPERADMIN)?.Id,
  //       Birthdate: new Date('2001-01-19T00:00:00Z'),
  //       PhoneNumber: '08123456789',
  //       Gender: true,
  //     },
  //     {
  //       Id: generateUuid(),
  //       Name: 'Admin',
  //       Username: 'admin',
  //       Email: 'admin@mail.com',
  //       Password: hashPassword('junior12345'),
  //       RoleId: roles.find((a) => a.Name === RoleType.ADMIN)?.Id,
  //       Birthdate: new Date('2001-01-19T00:00:00Z'),
  //       PhoneNumber: '08123456789',
  //       Gender: false,
  //     },
  //     {
  //       Id: generateUuid(),
  //       Name: 'Eventadmin',
  //       Username: 'eventadmin',
  //       Email: 'eventadmin@mail.com',
  //       Password: hashPassword('junior12345'),
  //       RoleId: roles.find((a) => a.Name === RoleType.EVENTADMIN)?.Id,
  //       Birthdate: new Date('2001-01-19T00:00:00Z'),
  //       PhoneNumber: '08123456789',
  //       Gender: false,
  //     },
  //     {
  //       Id: generateUuid(),
  //       Name: 'Facilitator',
  //       Username: 'facilitator',
  //       Email: 'facilitator@mail.com',
  //       Password: hashPassword('junior12345'),
  //       RoleId: roles.find((a) => a.Name === RoleType.FACILITATOR)?.Id,
  //       Birthdate: new Date('2001-01-19T00:00:00Z'),
  //       PhoneNumber: '08123456789',
  //       Gender: false,
  //     },
  //     {
  //       Id: generateUuid(),
  //       Name: 'Participant',
  //       Username: 'participant',
  //       Email: 'participant@mail.com',
  //       Password: hashPassword('junior12345'),
  //       RoleId: roles.find((a) => a.Name === RoleType.PARTICIPANT)?.Id,
  //       Birthdate: new Date('2001-01-19T00:00:00Z'),
  //       PhoneNumber: '08123456789',
  //       Gender: false,
  //     },
  //   ],
  // });
  // #endregion
  // #region School
  // await prisma.school.createMany({
  //   skipDuplicates: true,
  //   data: [
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Name: 'SD NEGERI 1 KANDANGAN',
  //       Subdistrict: 'PESANGGARAN' as Subdistrict,
  //       Ward: 'KANDANGAN',
  //       Status: 'NEGERI' as StatusSchool,
  //       Stage: 'SD' as StageType,
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Name: 'SMP NEGERI 1 CLURING',
  //       Subdistrict: 'CLURING' as Subdistrict,
  //       Ward: 'CLURING',
  //       Status: 'NEGERI' as StatusSchool,
  //       Stage: 'SMP' as StageType,
  //     },
  //   ],
  // });
  // #endregion
  //

  // #region Season
  // await prisma.season.createMany({
  //   skipDuplicates: true,
  //   data: [
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Name: '1',
  //       StartDate: new Date('2025-02-23T00:00:00Z'),
  //       EndDate: new Date('2025-05-01T00:00:00Z'),
  //     },
  //   ],
  // });
  // #endregion

  // #region Subject
  // await prisma.subject.createMany({
  //   skipDuplicates: true,
  //   data: [
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Name: 'matematika',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Name: 'ipa',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Name: 'bahasa inggris',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Name: 'ips',
  //     },
  //   ],
  // });
  // #endregion

  // #region Kisi
  await prisma.kisi.createMany({
    skipDuplicates: true,
    data: [
      {
        Id: generateUuid(),
        DateCreate: new Date(),
        DateUpdate: new Date(),
        Content: 'Bilangan bulat',
        CompetitionId: '6c1af2293ad8456eb31f',
      },
      {
        Id: generateUuid(),
        DateCreate: new Date(),
        DateUpdate: new Date(),
        Content: 'Bilangan pecahan',
        CompetitionId: '6c1af2293ad8456eb31f',
      },
    ],
  });
  // #endregion
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
