import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

import { AuthModule } from './controller/auth/auth.module';
import { GlobalModule } from './controller/global/global.module';
import { SharedModule } from './shared.module';
import { PublicModule } from './controller/public/public.module';
import { AdminModule } from './controller/admin/admin.module';
import { StudentModule } from './controller/student/student.module';
import { UserModule } from './controller/user/user.module';
import { EventModule } from './controller/event/event.module';
import { ActivityModule } from './controller/activity/activity.module';
import { PaymentModule } from './controller/payment/payment.module';
import { RoleModule } from './controller/role/role.module';
import { SchoolModule } from './controller/school/school.module';
import { SubjectModule } from './controller/subject/subject.module';
import { RegionalModule } from './controller/regional/regional.module';
import { StatisticsModule } from './controller/statistics/statistics.module';
import { ClassesModule } from './controller/classes/classes.module';

import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'student_pdfs'),
      serveRoot: 'files',
    }),
    // Module
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration module global
      envFilePath: ['.env'], // Optional: Load environment variables from a .env file
    }),
    RouterModule.register([
      {
        path: 'v1/auth',
        module: AuthModule,
      },
      {
        path: 'v1/admin',
        module: AdminModule,
      },
      {
        path: 'v1/student',
        module: StudentModule,
      },
      {
        path: 'v1/user',
        module: UserModule,
      },
      {
        path: 'v1/event',
        module: EventModule,
      },
      {
        path: 'v1/activity',
        module: ActivityModule,
      },
      {
        path: 'v1/payment',
        module: PaymentModule,
      },
      {
        path: 'v1/role',
        module: RoleModule,
      },
      {
        path: 'v1/school',
        module: SchoolModule,
      },
      {
        path: 'v1/subject',
        module: SubjectModule,
      },
      {
        path: 'v1/classes',
        module: ClassesModule,
      },
      {
        path: 'v1/regional',
        module: RegionalModule,
      },
      {
        path: 'v1/statistics',
        module: StatisticsModule,
      },
      {
        path: 'v1/public',
        module: PublicModule,
      },
      {
        path: 'v1',
        module: GlobalModule,
      },
    ]),
    SharedModule,

    // Controller
    AuthModule,
    GlobalModule,
    PublicModule,
    AdminModule,
    StudentModule,
    UserModule,
    EventModule,
    ActivityModule,
    PaymentModule,
    RoleModule,
    SchoolModule,
    SubjectModule,
    RegionalModule,
    StatisticsModule,
    ClassesModule,
  ],
})
export class AppModule {}
