import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
        SchoolId: body.schoolId,
        FatherName: body.fatherName,
        MotherName: body.motherName,
        IdUser: body.idUser,
        PhotoPath: body.photoPath,
        Poin: body.poin,
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: `Success ${body.id ? 'Update' : 'Create'} Student`,
      data: { id: student.Id },
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
