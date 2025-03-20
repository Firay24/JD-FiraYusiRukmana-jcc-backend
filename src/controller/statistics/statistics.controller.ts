import { BadRequestException, Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
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
  @Get(':id')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN])
  async statistics(@Req() request: Request, @Param('id') id: string) {
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
      where: { RegionId: id },
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

    // structure report
    const report = {};
    const totalPerStage = { TK: 0, SD: 0, SMP: 0 };
    const totalPerLevel = {};
    const totalPerSubject = {};
    let grandTotal = 0;
    const subjects = new Set<string>();

    competitionsDb.forEach((competition) => {
      const subjectName = competition.Subject.Name;
      subjects.add(subjectName);

      competition.CompetitionParticipant.forEach((participant) => {
        const student = participant.Student;
        if (!student) return;

        const stage = student.Stage;
        const studentClass = student.Class;

        // Inisialisasi struktur data untuk jenjang
        if (!report[stage]) {
          report[stage] = {};
        }
        if (!report[stage][studentClass]) {
          report[stage][studentClass] = {};
        }
        if (!report[stage][studentClass][subjectName]) {
          report[stage][studentClass][subjectName] = 0;
        }

        // Tambahkan jumlah peserta untuk tiap kategori
        report[stage][studentClass][subjectName] += 1;
        totalPerStage[stage] += 1;
        grandTotal += 1;

        // Akumulasi total per kelas dalam jenjang
        if (!totalPerLevel[stage]) {
          totalPerLevel[stage] = {};
        }
        if (!totalPerLevel[stage][studentClass]) {
          totalPerLevel[stage][studentClass] = 0;
        }
        totalPerLevel[stage][studentClass] += 1;

        // Akumulasi total per mata pelajaran
        if (!totalPerSubject[subjectName]) {
          totalPerSubject[subjectName] = 0;
        }
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
