import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { Roles } from 'src/guard/roles/roles.decorator';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { StudentSaveDto } from 'src/types/controller/student/student.dto';
import { Request } from 'express';

@Controller()
@UseGuards(RolesGuard)
export class StudentController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  // #region profile
  @Get('dashboard/profile')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async profileDashboard(@Req() request: Request) {
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

    const dbStudent = await this.prismaService.student.findFirst({
      where: { IdUser: user.id },
      include: { CompetitionParticipant: true },
    });

    // if (!dbStudent) {
    //   throw new BadRequestException(
    //     this.utilityService.globalResponse({
    //       statusCode: 400,
    //       message: 'Student not found',
    //     }),
    //   );
    // }

    if (!dbStudent) {
      return this.utilityService.globalResponse({
        statusCode: 204,
      });
    }

    const averageScore = await this.prismaService.competitionParticipant.aggregate({
      where: {
        StudentId: dbStudent.Id,
        Score: {
          not: null,
        },
      },
      _avg: { Score: true },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        nama: dbUser.Name,
        username: dbUser.Username,
        poin: dbStudent.Poin,
        totalActivity: dbStudent.CompetitionParticipant.length,
        avarageScore: averageScore._avg.Score,
        gender: dbUser.Gender,
      },
    });
  }
  // #endregion

  // #region participant
  @Get('list/all')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT])
  async listParticipant(@Req() request: Request, @Query('seasonId') seasonId: string, @Query('regionId') regionId: string) {
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

    const dbActivity = await this.prismaService.competitionParticipant.findMany({
      where: {
        Competition: {
          SeasonId: seasonId,
          RegionId: regionId,
        },
      },
      include: {
        Student: {
          include: {
            User: true,
            School: true,
          },
        },
        Competition: {
          include: {
            Season: true,
            Region: true,
            Subject: true,
          },
        },
      },
    });

    const groupedStudent = new Map<string, any>();

    for (const participant of dbActivity) {
      const studentId = participant.Student.Id;

      if (!groupedStudent.has(studentId)) {
        groupedStudent.set(studentId, {
          idMember: participant.Student.IdMember,
          name: participant.Student.User.Name,
          school: participant.Student.School.Name,
          class: participant.Student.Class,
          stage: participant.Student.Stage,
          subject: [],
        });
      }

      const group = groupedStudent.get(studentId);

      if (group.subject.length < 4) {
        group.subject.push(participant.Competition.Subject.Name);
      }
    }

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: Array.from(groupedStudent.values()),
    });
  }
  // #endregion

  // #region participant
  @Get('list/classes')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT])
  async listParticipantClass(@Req() request: Request, @Query('seasonId') seasonId: string, @Query('regionId') regionId: string) {
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

    const dbActivity = await this.prismaService.competitionParticipant.findMany({
      where: {
        Competition: {
          SeasonId: seasonId,
          RegionId: regionId,
        },
      },
      include: {
        CompetitionRoom: true,
        Student: {
          include: {
            User: true,
            School: true,
          },
        },
        Competition: {
          include: {
            Season: true,
            Region: true,
            Subject: true,
          },
        },
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: dbActivity.map((participant) => ({
        idMember: participant.Student.IdMember,
        name: participant.Student.User.Name,
        school: participant.Student.School.Name,
        class: participant.Student.Class,
        stage: participant.Student.Stage,
        mapel: participant.Competition.Subject.Name,
        room: participant.CompetitionRoom ? participant.CompetitionRoom.Name : '',
      })),
    });
  }
  // #endregion

  // #region student by payment
  @Get('payment/:id')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async studentByPayment(@Req() request: Request, @Param('id') id: string) {
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

    const dbParticipant = await this.prismaService.payment.findFirst({
      where: { Id: id },
      include: { CompetitionParticipant: { include: { Student: { include: { User: true } }, Competition: { include: { Subject: true, Season: true, Region: true } } } } },
    });

    if (!dbParticipant) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Participant not found',
        }),
      );
    }

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        regional: dbParticipant.CompetitionParticipant[0].Competition.Region.Name,
        participant: dbParticipant.CompetitionParticipant.map((participant) => {
          return {
            name: participant.Student.User.Name,
            username: participant.Student.User.Username,
            class: participant.Student.Class,
            stage: participant.Student.Stage,
            subject: participant.Competition.Subject.Name,
          };
        }),
      },
    });
  }
  // #endregion

  // #region save
  @Post('save')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async save(@Req() request: Request, @Body() body: StudentSaveDto) {
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

    const userExists = await this.prismaService.user.findFirst({
      where: { Id: body.idUser ?? '' },
    });

    if (!userExists) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'User not found',
        }),
      );
    }

    if (!/^\d{16}$/.test(body.nik)) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'NIK must be exactly 16 digits',
        }),
      );
    }

    const nikExists = await this.prismaService.student.findFirst({
      where: { NIK: body.nik },
    });

    if (nikExists && (!body.id || nikExists.Id !== body.id)) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'NIK already exists',
        }),
      );
    }

    const dbStudent = await this.prismaService.student.findFirst({
      where: { Id: body.id ?? '' },
    });

    const studentId = dbStudent ? dbStudent.Id : this.utilityService.generateUuid();

    let idMember: string;
    if (dbStudent) {
      idMember = dbStudent.IdMember;
    } else {
      const studentCount = await this.prismaService.student.count();
      idMember = (studentCount + 1).toString();
    }

    // Cek apakah Stage atau Class berubah
    const isStageChanged = dbStudent && dbStudent.Stage !== body.stage;
    const isClassChanged = dbStudent && dbStudent.Class !== body.class;

    const student = await this.prismaService.student.upsert({
      where: { Id: studentId },
      update: {
        Id: studentId,
        IdMember: idMember,
        Address: body.address,
        Stage: body.stage,
        Class: body.class,
        NIK: body.nik,
        SchoolId: body.schoolId,
        FatherName: body.fatherName,
        MotherName: body.motherName,
        IdUser: body.idUser,
        PhotoPath: body.photoPath,
        Poin: body.poin,
      },
      create: {
        Id: studentId,
        IdMember: idMember,
        Address: body.address,
        Stage: body.stage,
        Class: body.class,
        NIK: body.nik,
        FatherName: body.fatherName,
        MotherName: body.motherName,
        PhotoPath: body.photoPath,
        Poin: body.poin,
        User: {
          connect: {
            Id: body.idUser,
          },
        },
        School: {
          connect: {
            Id: body.schoolId,
          },
        },
      },
    });

    if (isClassChanged || isStageChanged) {
      const dbCompetitionParticipants = await this.prismaService.competitionParticipant.findMany({
        where: { StudentId: studentId },
        include: { Competition: true },
      });

      const upcomingCompetitions = dbCompetitionParticipants.filter((cp) => new Date(cp.Competition.Date * 1000) > new Date());

      for (const participant of upcomingCompetitions) {
        const { SeasonId, RegionId, SubjectId } = participant.Competition;

        const newCompetition = await this.prismaService.competition.findFirst({
          where: {
            SeasonId,
            RegionId,
            SubjectId,
            Stage: body.stage,
            Level: parseInt(body.class),
          },
        });

        if (newCompetition) {
          const newParticipantId = await this.utilityService.generateParticipantId(newCompetition.Id, studentId);

          await this.prismaService.competitionParticipant.update({
            where: { Id: participant.Id },
            data: {
              CompetitionId: newCompetition.Id,
              ParticipantId: newParticipantId,
            },
          });
        }
      }
    }

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: `Success ${body.id ? 'Update' : 'Create'} Student`,
      data: { id: student.Id, idMember: student.IdMember },
    });
  }
  //#endregion

  //#region profile
  @Get('profile')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async profile(@Req() request: Request) {
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

    const dbStudent = await this.prismaService.student.findFirst({
      where: { IdUser: user.id },
      include: { School: true, User: true },
    });

    if (!dbStudent) {
      return this.utilityService.globalResponse({
        statusCode: 204,
      });
    }

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        id: dbStudent.Id,
        userId: dbStudent.User.Id,
        name: dbStudent.User.Name,
        username: dbStudent.User.Username,
        gender: dbStudent.User.Gender,
        birthdate: dbStudent.User.Birthdate,
        phoneNumber: dbStudent.User.PhoneNumber,
        address: dbStudent.Address,
        school: dbStudent.School.Name,
        idSchool: dbStudent.School.Id,
        stage: dbStudent.Stage,
        class: dbStudent.Class,
        nik: dbStudent.NIK,
        fatherName: dbStudent.FatherName,
        motherName: dbStudent.MotherName,
        photoPath: dbStudent.PhotoPath,
        poin: dbStudent.Poin,
      },
    });
  }
  //#endregion
}
