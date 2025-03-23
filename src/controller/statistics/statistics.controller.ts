import { BadRequestException, Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';

@Controller()
@UseGuards(RolesGuard)
export class StatisticsController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  // #region statistic
  @Get('summary')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN])
  async statistics(@Req() request: Request, @Query('id') id: string) {
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

    const competitionsDb = await this.prismaService.competition.findMany({
      where: id ? { RegionId: id } : {},
      include: {
        Subject: true,
        CompetitionParticipant: {
          include: {
            Student: true,
            Competition: {
              include: { Subject: true },
            },
          },
        },
      },
    });

    const classLevels = {
      TK: [1],
      SD: [1, 2, 3, 4, 5, 6],
      SMP: [1, 2, 3],
    };

    // structure report
    const report = {};
    const totalPerStage = { TK: 0, SD: 0, SMP: 0 };
    const totalPerLevel = {};
    const totalPerSubject = {};
    let grandTotal = 0;
    const subjects = new Set<string>();

    // 🔹 Inisialisasi report dengan kelas lengkap dan mata pelajaran unik
    competitionsDb.forEach((competition) => {
      const subjectName = competition.Subject.Name;
      subjects.add(subjectName);
    });

    Array.from(subjects).forEach((subject) => {
      totalPerSubject[subject] = 0;
    });

    Object.keys(classLevels).forEach((stage) => {
      report[stage] = {};
      totalPerLevel[stage] = {};

      classLevels[stage].forEach((studentClass) => {
        report[stage][studentClass] = {};
        totalPerLevel[stage][studentClass] = 0;

        Array.from(subjects).forEach((subject) => {
          report[stage][studentClass][subject] = 0;
        });
      });
    });

    competitionsDb.forEach((competition) => {
      const subjectName = competition.Subject.Name;

      competition.CompetitionParticipant.forEach((participant) => {
        const student = participant.Student;
        if (!student) return;

        const stage = student.Stage;
        const studentClass = student.Class;

        if (!report[stage] || !report[stage][studentClass]) return;

        report[stage][studentClass][subjectName] += 1;
        totalPerStage[stage] += 1;
        grandTotal += 1;

        totalPerLevel[stage][studentClass] += 1;

        totalPerSubject[subjectName] += 1;
      });
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        totalPerStage,
        totalPerLevel,
        totalPerSubject,
        grandTotal,
        subjects: Array.from(subjects),
        report,
      },
    });
  }
}
