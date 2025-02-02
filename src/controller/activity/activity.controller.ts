import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { CompetitionSaveDto } from 'src/types/controller/competition/competition.dto';
import { Request } from 'express';
import * as fs from 'fs';
import * as xlsx from 'xlsx';
import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { StageType } from '@prisma/client';

interface ExcelRow {
  name: string;
  username: string;
  password: string;
  gender: string;
  phoneNumber: string;
  address: string;
  stage: string;
  class: string;
  nik: string;
  fatherName: string;
  motherName: string;
  level: string;
  subject: string;
  birthdate: string;
}

@Controller()
@UseGuards(RolesGuard)
export class ActivityController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  // #region get by id
  @Get('detail/:id')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT])
  async detail(@Req() request: Request, @Param('id') id: string) {
    const user = request.user;
    const dbUser = await this.prismaService.user.findFirst({
      where: { Id: user.id },
      include: { Role: true },
    });

    if (!dbUser) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'User not found',
        }),
      );
    }

    const dbActivity = await this.prismaService.competitionParticipant.findFirst({
      where: { Id: id },
      include: { Competition: { include: { Subject: true, Season: true, Region: true } }, CompetitionRoom: { include: { Supervisor: true } }, Student: { include: { User: true, School: true } }, Payment: { include: { PaymentStatusHistory: { orderBy: { Date: 'asc' } } } } },
    });

    if (!dbActivity) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Activity not found',
        }),
      );
    }

    const latestStatusHistory = dbActivity.Payment.PaymentStatusHistory.length > 0 ? dbActivity.Payment.PaymentStatusHistory[dbActivity.Payment.PaymentStatusHistory.length - 1] : null;

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        id: dbActivity.Id,
        participantId: dbActivity.ParticipantId,
        paymentId: dbActivity.PaymentId,
        paymentDate: dbActivity.Payment.Date,
        invoice: dbActivity.Payment.Invoice,
        student: {
          studentId: dbActivity.StudentId,
          userId: dbActivity.Student.User.Id,
          name: dbActivity.Student.User.Name,
          school: dbActivity.Student.School.Name,
          class: dbActivity.Student.Class,
          stage: dbActivity.Competition.Stage,
          phoneNumber: dbActivity.Student.User.PhoneNumber,
          nik: dbActivity.Student.NIK,
        },
        events: {
          season: dbActivity.Competition.Season.Name,
          region: dbActivity.Competition.Region.Region.toString(),
          price: dbActivity.Payment.Amount,
          level: dbActivity.Competition.Level,
          stage: dbActivity.Competition.Stage,
          subject: dbActivity.Competition.Subject.Name,
          date: dbActivity.Competition.Date,
          location: dbActivity.Competition.Location,
          room: dbActivity.CompetitionRoom ? dbActivity.CompetitionRoom.Name : null,
          supervisor: dbActivity.CompetitionRoom ? dbActivity.CompetitionRoom.Supervisor.Name : null,
        },
        detailStatus: dbActivity.Payment.PaymentStatusHistory.map((history) => ({
          status: history.Status,
          date: history.Date,
        })),
        latestStatus: {
          status: latestStatusHistory.Status,
          date: latestStatusHistory.Date,
        },
      },
    });
  }
  // #endregion

  // #region list all
  @Get('list/all')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT])
  async listAll(@Req() request: Request, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    const user = request.user;
    const dbUser = await this.prismaService.user.findFirst({
      where: { Id: user.id },
      include: { Role: true },
    });

    if (!dbUser) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'User not found',
        }),
      );
    }

    limit = Math.max(1, Math.min(limit, 100));

    const skip = (page - 1) * limit;
    const totalItems = await this.prismaService.competition.count();
    const totalPages = Math.ceil(totalItems / limit);

    const dbActivity = await this.prismaService.competitionParticipant.findMany({
      skip,
      take: limit,
      include: { Payment: true, Student: { include: { User: true, School: true } } },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        page,
        limit,
        totalItems,
        totalPages,
        data: dbActivity.map((activity) => ({
          id: activity.Id,
          name: activity.Student.User.Name,
          idParticipant: activity.ParticipantId,
          school: activity.Student.School.Name,
          class: activity.Student.Class,
          stage: activity.Student.Stage,
          phoneNumber: activity.Student.User.PhoneNumber,
          nik: activity.Student.NIK,
          payment: activity.Payment.Status,
        })),
      },
    });
  }
  // #endregion

  // #region list
  @Get('list')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT])
  async list(@Req() request: Request, @Query('page') page: number = 1, @Query('limit') limit: number = 20) {
    const user = request.user;
    const dbUser = await this.prismaService.user.findFirst({
      where: { Id: user.id },
      include: { Role: true },
    });

    if (!dbUser) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'User not found',
        }),
      );
    }

    const dbstudent = await this.prismaService.student.findFirst({
      where: { IdUser: user.id },
    });

    limit = Math.max(1, Math.min(limit, 100));

    const skip = (page - 1) * limit;
    const totalItems = await this.prismaService.competition.count();
    const totalPages = Math.ceil(totalItems / limit);

    const dbActivity = await this.prismaService.competitionParticipant.findMany({
      skip,
      take: limit,
      include: { Competition: { include: { Season: true, Subject: true, Region: true } }, Payment: true },
      where: { StudentId: dbstudent?.Id },
      orderBy: { DateCreate: 'desc' },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        page,
        limit,
        totalItems,
        totalPages,
        data: dbActivity.map((activity) => ({
          id: activity.Id,
          statusPayment: activity.Payment?.Status,
          competition: {
            name: activity.Competition.Name,
            description: activity.Competition.Description,
            date: activity.Competition.Date,
            subject: activity.Competition.Subject.Name,
            region: {
              name: activity.Competition.Region.Name,
              region: activity.Competition.Region.Region,
            },
            season: activity.Competition.Season.Name,
          },
        })),
      },
    });
  }
  // #endregion

  // #region save
  @Post('save')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT])
  async saveActivity(@Req() request: Request, @Body() body: CompetitionSaveDto) {
    const user = request.user;
    const dbUser = await this.prismaService.user.findFirst({
      where: { Id: user.id },
      include: { Role: true },
    });

    if (!dbUser) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'User not found',
        }),
      );
    }

    const dbEvent = await this.prismaService.competition.findFirst({
      where: { Id: body.competitionId ?? '' },
    });

    if (!dbEvent) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Competition not found',
        }),
      );
    }

    const existingParticipant = await this.prismaService.competitionParticipant.findFirst({
      where: {
        StudentId: body.studentId,
        CompetitionId: body.competitionId,
      },
      include: { Payment: true },
    });

    if (existingParticipant) {
      return this.utilityService.globalResponse({
        statusCode: 400,
        message: 'Participant already registered',
        data: { id: existingParticipant.Id },
      });
    }

    let paymentId = existingParticipant?.Payment?.Id;
    if (!paymentId) {
      const payment = await this.prismaService.payment.create({
        data: {
          Id: this.utilityService.generateUuid(),
          Invoice: this.utilityService.generateInvoice(),
          Date: this.utilityService.getEpoch(new Date()),
          Amount: dbEvent.Price,
          Status: 'PENDING',
        },
      });
      await this.prismaService.paymentStatusHistory.create({
        data: {
          Id: this.utilityService.generateUuid(),
          PaymentId: payment.Id,
          Status: 'PENDING',
          Date: this.utilityService.getEpoch(new Date()),
        },
      });
      paymentId = payment.Id;
    }

    const dbCompetitionParticipant = await this.prismaService.competitionParticipant.findFirst({
      where: { Id: body.id ?? '' },
    });

    const competitionParticipantId = dbCompetitionParticipant ? dbCompetitionParticipant.Id : this.utilityService.generateUuid();
    const participantId = await this.utilityService.generateParticipantId(body.competitionId);

    const competition = await this.prismaService.competitionParticipant.upsert({
      where: { Id: competitionParticipantId },
      update: {
        Id: competitionParticipantId,
        ParticipantId: participantId,
        StudentId: body.studentId,
        CompetitionId: body.competitionId,
        CompetitionRoomId: body.competitionRommId,
        PaymentId: body.paymentId,
        Attedance: body.attedance,
        Score: body.score,
        Correct: body.correct,
        Incorrect: body.incorrect,
        PathAnswer: body.pathAnswer,
      },
      create: {
        Id: competitionParticipantId,
        ParticipantId: participantId,
        StudentId: body.studentId,
        CompetitionId: body.competitionId,
        CompetitionRoomId: body.competitionRommId,
        PaymentId: paymentId,
        Attedance: body.attedance ?? false,
        Score: body.score ?? 0,
        Correct: body.correct ?? 0,
        Incorrect: body.incorrect ?? 0,
        PathAnswer: body.pathAnswer ?? '',
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: `Success ${body.id ? 'Update' : 'Create'} Competition`,
      data: { id: competition.Id },
    });
  }
  // #endregion

  // #region batch save
  @Post('batch-save')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return cb(new BadRequestException('Only Excel files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('schoolId') schoolId: string) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = path.join(process.cwd(), 'uploads', file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data: ExcelRow[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    fs.unlinkSync(filePath);

    let totalAmount = 0;
    const payment = await this.prismaService.payment.create({
      data: {
        Id: this.utilityService.generateUuid(),
        Invoice: this.utilityService.generateInvoice(),
        Date: this.utilityService.getEpoch(new Date()),
        Amount: 0,
        Status: 'PENDING',
      },
    });

    await this.prismaService.paymentStatusHistory.create({
      data: {
        Id: this.utilityService.generateUuid(),
        PaymentId: payment.Id,
        Status: 'PENDING',
        Date: this.utilityService.getEpoch(new Date()),
      },
    });

    for (const row of data) {
      let student = await this.prismaService.student.findFirst({
        where: { NIK: row.nik },
      });

      if (!student) {
        const dbUser = await this.prismaService.user.findFirst({
          where: { Username: row.username },
        });
        if (dbUser)
          return this.utilityService.globalResponse({
            statusCode: 409,
            message: 'Username already exists',
          });

        const messagePassword = this.utilityService.validatePassword(row.password);
        if (messagePassword)
          return this.utilityService.globalResponse({
            statusCode: 400,
            message: messagePassword,
          });

        const hashedPassword = this.utilityService.hashPassword(row.password);
        const user = await this.prismaService.user.create({
          data: {
            Id: this.utilityService.generateId(),
            Name: row.name,
            Username: row.username,
            Password: hashedPassword,
            RoleId: '67cb3b008ca0499c84fc',
            Birthdate: this.utilityService.getEpoch(new Date(row.birthdate)),
            Gender: row.gender === 'Perempuan' ? false : true,
            PhoneNumber: row.phoneNumber,
          },
        });

        student = await this.prismaService.student.create({
          data: {
            Id: this.utilityService.generateId(),
            Address: row.address,
            Stage: row.stage as StageType,
            Class: row.class.toString(),
            SchoolId: schoolId,
            NIK: row.nik,
            FatherName: row.fatherName,
            MotherName: row.motherName,
            IdUser: user.Id,
          },
        });
      }

      const subject = await this.prismaService.subject.findFirst({
        where: { Name: row.subject },
      });

      const dbEvent = await this.prismaService.competition.findFirst({
        where: { Stage: row.stage as StageType, Level: parseInt(row.level, 10), SubjectId: subject.Id },
      });

      if (!dbEvent) {
        return this.utilityService.globalResponse({
          statusCode: 404,
          message: `Competition not found for subject: ${row.subject}, stage: ${row.stage}, level: ${row.level}`,
        });
      }

      totalAmount += dbEvent.Price;
      const participantId = await this.utilityService.generateParticipantId(dbEvent.Id);

      await this.prismaService.competitionParticipant.create({
        data: {
          Id: this.utilityService.generateId(),
          ParticipantId: participantId,
          StudentId: student.Id,
          CompetitionId: dbEvent.Id,
          PaymentId: payment.Id,
          Attedance: false,
          Score: 0,
          Correct: 0,
          Incorrect: 0,
          PathAnswer: '',
        },
      });
    }

    await this.prismaService.payment.update({
      where: { Id: payment.Id },
      data: {
        Amount: totalAmount,
      },
    });

    return {
      message: 'Upload sukses',
      data: {
        totalParticipant: data.length,
        amount: totalAmount,
      },
    };
  }
  // #endregion
}
