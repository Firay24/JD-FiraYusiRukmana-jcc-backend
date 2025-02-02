import { PrismaClient, StageType, StatusSchool, Subdistrict } from '@prisma/client';

const prisma = new PrismaClient();

import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
// import * as bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { schools } from '../src/data/school';

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
  // #region school
  await prisma.school.createMany({
    skipDuplicates: true,
    data: schools.map((school) => ({
      Id: generateUuid(),
      Name: school.name,
      Stage: school.stage as StageType,
      Subdistrict: school.subdistrict as Subdistrict,
      Ward: school.ward,
      Status: school.status as StatusSchool,
    })),
  });
  // #endregion
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
  //       Birthdate: 980955648,
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
  //       Birthdate: 980955648,
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
  //       Birthdate: 980955648,
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
  //       Birthdate: 980955648,
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
  //       Birthdate: 980955648,
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
  //       StartDate: 1740325248,
  //       EndDate: 1748792448,
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
  // await prisma.kisi.createMany({
  //   skipDuplicates: true,
  //   data: [
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Content: 'Bilangan bulat',
  //       CompetitionId: '3d25d0c6923d40198b0f',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Content: 'Bilangan pecahan',
  //       CompetitionId: '3d25d0c6923d40198b0f',
  //     },
  //   ],
  // });
  // #endregion
  // #region Region
  // await prisma.region.createMany({
  //   skipDuplicates: true,
  //   data: [
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 1,
  //       Name: 'Regional 1 - Pesanggaran',
  //       RegionDetail: 'Pesanggaran, Siliragung',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 2,
  //       Name: 'Regional 2 - Purwoharjo',
  //       RegionDetail: 'Purwoharjo, Tegaldlimo',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 3,
  //       Name: 'Regional 3 - Srono',
  //       RegionDetail: 'Srono, Muncar',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 4,
  //       Name: 'Regional 4 - Pesanggaran',
  //       RegionDetail: 'Pesanggaran, Siliragung',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 5,
  //       Name: 'Regional 5 - Genteng',
  //       RegionDetail: 'Genteng',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 6,
  //       Name: 'Regional 6 - Glenmore',
  //       RegionDetail: 'Glenmore, Kalibaru',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 7,
  //       Name: 'Regional 7 - Sempu',
  //       RegionDetail: 'Sempu, Songgon',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 8,
  //       Name: 'Regional 8 - Rogojampi',
  //       RegionDetail: 'Rogojampi, Singojuruh, Blimbingsari, Kabat',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 9,
  //       Name: 'Regional 9 - Banyuwangi Kota',
  //       RegionDetail: 'Banyuwangi, Glagah, Giri, Licin',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 10,
  //       Name: 'Regional 10 - Wongsorejo',
  //       RegionDetail: 'Wongsorejo, Kalipuro',
  //     },
  //     {
  //       Id: generateUuid(),
  //       DateCreate: new Date(),
  //       DateUpdate: new Date(),
  //       Region: 11,
  //       Name: 'Regional 11 - Tegalsari',
  //       RegionDetail: 'Tegalsari, Bangorejo',
  //     },
  //   ],
  // });
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
