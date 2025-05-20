
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.RoleScalarFieldEnum = {
  Id: 'Id',
  Name: 'Name',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate'
};

exports.Prisma.UserScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Name: 'Name',
  Username: 'Username',
  Password: 'Password',
  RoleId: 'RoleId',
  Birthdate: 'Birthdate',
  BirthPlace: 'BirthPlace',
  PhoneNumber: 'PhoneNumber',
  Gender: 'Gender',
  Email: 'Email',
  Status: 'Status'
};

exports.Prisma.StudentScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  IdMember: 'IdMember',
  Address: 'Address',
  Stage: 'Stage',
  Class: 'Class',
  SchoolId: 'SchoolId',
  NIK: 'NIK',
  FatherName: 'FatherName',
  MotherName: 'MotherName',
  IdUser: 'IdUser',
  PhotoPath: 'PhotoPath',
  Poin: 'Poin'
};

exports.Prisma.AchievementScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  StudentId: 'StudentId',
  Category: 'Category',
  Describe: 'Describe',
  SertifNumber: 'SertifNumber',
  Note: 'Note',
  CompetitionId: 'CompetitionId'
};

exports.Prisma.SeasonScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Name: 'Name',
  StartDate: 'StartDate',
  EndDate: 'EndDate'
};

exports.Prisma.SubjectScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Name: 'Name'
};

exports.Prisma.CompetitionScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Name: 'Name',
  Description: 'Description',
  Date: 'Date',
  Level: 'Level',
  Stage: 'Stage',
  Price: 'Price',
  Location: 'Location',
  SeasonId: 'SeasonId',
  RegionId: 'RegionId',
  SubjectId: 'SubjectId',
  CodePackage: 'CodePackage',
  PathAnswer: 'PathAnswer',
  regionId: 'regionId'
};

exports.Prisma.SubscriptionScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  StartDate: 'StartDate',
  EndDate: 'EndDate',
  Status: 'Status',
  PaymentId: 'PaymentId',
  StudentId: 'StudentId',
  CompetitionId: 'CompetitionId'
};

exports.Prisma.RegionScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Region: 'Region',
  Name: 'Name',
  RegionDetail: 'RegionDetail'
};

exports.Prisma.SupervisorScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Name: 'Name',
  Birthdate: 'Birthdate',
  PhoneNumber: 'PhoneNumber'
};

exports.Prisma.RoomScalarFieldEnum = {
  Id: 'Id',
  Name: 'Name',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate'
};

exports.Prisma.CompetitionRoomScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  RoomId: 'RoomId',
  CompetitionId: 'CompetitionId',
  SupervisorId: 'SupervisorId'
};

exports.Prisma.CompetitionParticipantScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  ParticipantId: 'ParticipantId',
  SertifNumber: 'SertifNumber',
  StudentId: 'StudentId',
  CompetitionId: 'CompetitionId',
  CompetitionRoomId: 'CompetitionRoomId',
  PaymentId: 'PaymentId',
  Attedance: 'Attedance',
  Score: 'Score',
  Correct: 'Correct',
  Incorrect: 'Incorrect',
  PathAnswer: 'PathAnswer',
  Index: 'Index'
};

exports.Prisma.KisiScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Header: 'Header',
  Content: 'Content',
  CompetitionId: 'CompetitionId'
};

exports.Prisma.TryoutScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Name: 'Name',
  CompetitionId: 'CompetitionId'
};

exports.Prisma.QuestionScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  TryoutId: 'TryoutId',
  Content: 'Content'
};

exports.Prisma.OptionScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Answer: 'Answer',
  IsCorrect: 'IsCorrect',
  QuestionId: 'QuestionId'
};

exports.Prisma.PaymentScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Invoice: 'Invoice',
  Date: 'Date',
  Amount: 'Amount',
  PathTransaction: 'PathTransaction',
  UserId: 'UserId',
  Status: 'Status'
};

exports.Prisma.PaymentStatusHistoryScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  PaymentId: 'PaymentId',
  Status: 'Status',
  Date: 'Date'
};

exports.Prisma.SchoolScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Name: 'Name',
  Stage: 'Stage',
  Subdistrict: 'Subdistrict',
  Ward: 'Ward',
  Status: 'Status'
};

exports.Prisma.NewsScalarFieldEnum = {
  Id: 'Id',
  DateCreate: 'DateCreate',
  DateUpdate: 'DateUpdate',
  Title: 'Title',
  Description: 'Description'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.RoleType = exports.$Enums.RoleType = {
  SUPERADMIN: 'SUPERADMIN',
  ADMIN: 'ADMIN',
  EVENTADMIN: 'EVENTADMIN',
  PARTICIPANT: 'PARTICIPANT',
  FACILITATOR: 'FACILITATOR'
};

exports.ActiveStatus = exports.$Enums.ActiveStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
};

exports.StageType = exports.$Enums.StageType = {
  TK: 'TK',
  SD: 'SD',
  SMP: 'SMP',
  LEMBAGA: 'LEMBAGA'
};

exports.PaymentType = exports.$Enums.PaymentType = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED'
};

exports.StatusSchool = exports.$Enums.StatusSchool = {
  SWASTA: 'SWASTA',
  NEGERI: 'NEGERI'
};

exports.Prisma.ModelName = {
  Role: 'Role',
  User: 'User',
  Student: 'Student',
  Achievement: 'Achievement',
  Season: 'Season',
  Subject: 'Subject',
  Competition: 'Competition',
  Subscription: 'Subscription',
  Region: 'Region',
  Supervisor: 'Supervisor',
  Room: 'Room',
  CompetitionRoom: 'CompetitionRoom',
  CompetitionParticipant: 'CompetitionParticipant',
  Kisi: 'Kisi',
  Tryout: 'Tryout',
  Question: 'Question',
  Option: 'Option',
  Payment: 'Payment',
  PaymentStatusHistory: 'PaymentStatusHistory',
  School: 'School',
  News: 'News'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
