import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { AchivementSaveDto } from 'src/types/controller/achievement/achievement.dto';

@Controller()
@UseGuards(RolesGuard)
@Controller('achievement')
export class AchievementController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilityService: UtilityService,
  ) {}

  // #region save
  @Post('save')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.SUPERADMIN])
  async save(@Req() request: Request, @Body() body: AchivementSaveDto) {
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

    const dbAchi = await this.prismaService.achievement.findFirst({
      where: { Id: body.id ?? '' },
    });
    const excitingAchi = await this.prismaService.achievement.findFirst({
      where: { StudentId: body.studentId, CompetitionId: body.competitionId },
    });

    if (excitingAchi) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Student already exist',
        }),
      );
    }

    const achiId = dbAchi ? dbAchi.Id : this.utilityService.generateUuid();

    const maxSertif = await this.prismaService.achievement.findFirst({
      where: {
        SertifNumber: { not: null },
      },
      orderBy: {
        SertifNumber: 'desc',
      },
      select: {
        SertifNumber: true,
      },
    });

    const currentSertifNumber = (maxSertif?.SertifNumber ?? 0) + 1;

    const school = await this.prismaService.achievement.upsert({
      where: { Id: achiId },
      update: {
        Id: achiId,
        StudentId: body.studentId,
        CompetitionId: body.competitionId,
        SertifNumber: body.sertifNumber ?? excitingAchi.SertifNumber,
        Category: body.category,
        Describe: body.describe,
        Note: body.note,
      },
      create: {
        Id: achiId,
        StudentId: body.studentId,
        CompetitionId: body.competitionId,
        SertifNumber: body.sertifNumber ?? currentSertifNumber,
        Category: body.category,
        Describe: body.describe,
        Note: body.note,
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: `Success ${body.id ? 'Update' : 'Create'} Achievement`,
      data: { id: school.Id },
    });
  }
  // #endRegion

  @Post('create')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.SUPERADMIN])
  async saveAchievementsFromTop3(@Req() request: Request, @Query('idCompetition') idCompetition: string) {
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

    // Validasi competition
    const competition = await this.prismaService.competition.findFirst({
      where: { Id: idCompetition },
    });

    if (!competition) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 404,
          message: 'Competition not found',
        }),
      );
    }

    // Ambil 3 nilai tertinggi
    const topParticipants = await this.prismaService.competitionParticipant.findMany({
      where: {
        CompetitionId: idCompetition,
        Score: { not: null },
      },
      orderBy: { Score: 'desc' },
      take: 3,
      include: {
        Student: true,
      },
    });

    // if (topParticipants.length < 3) {
    //   throw new BadRequestException(
    //     this.utilityService.globalResponse({
    //       statusCode: 400,
    //       message: 'Not enough participants to determine top 3',
    //     }),
    //   );
    // }

    // Ambil sertif number tertinggi
    const maxSertif = await this.prismaService.achievement.findFirst({
      where: { SertifNumber: { not: null } },
      orderBy: { SertifNumber: 'desc' },
      select: { SertifNumber: true },
    });

    let sertifNumber = (maxSertif?.SertifNumber ?? 0) + 1;

    const categories = ['Juara 1', 'Juara 2', 'Juara 3'];

    const createdAchievements = [];

    for (let i = 0; i < topParticipants.length; i++) {
      const participant = topParticipants[i];

      const existing = await this.prismaService.achievement.findFirst({
        where: {
          StudentId: participant.StudentId,
          CompetitionId: idCompetition,
        },
      });

      if (!existing) {
        const achi = await this.prismaService.achievement.create({
          data: {
            Id: this.utilityService.generateUuid(),
            StudentId: participant.StudentId,
            CompetitionId: idCompetition,
            SertifNumber: sertifNumber++,
            Category: categories[i],
            Describe: '',
            Note: '',
          },
        });

        createdAchievements.push({
          id: achi.Id,
          studentId: achi.StudentId,
          category: achi.Category,
        });
      }
    }

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Successfully created achievements for top 3 participants',
      data: createdAchievements,
    });
  }

  // #region winner
  @Get('winner/:idregional')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.SUPERADMIN])
  async winner(@Req() request: Request, @Param('idregional') idregional: string) {
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

    const competitions = await this.prismaService.competition.findMany({
      where: {
        RegionId: idregional,
      },
      include: {
        CompetitionParticipant: true,
        Subject: true,
        Region: true,
        Achievement: {
          include: {
            Student: {
              include: {
                User: true,
                School: true,
              },
            },
          },
        },
      },
    });

    const juaraOrder = {
      'Juara 1': 1,
      'Juara 2': 2,
      'Juara 3': 3,
    };

    const subjectOrder = {
      matematika: 1,
      'bahasa inggris': 2,
      ipa: 3,
      ips: 4,
    };

    const stageOrder = {
      TK: 1,
      SD: 2,
      SMP: 3,
    };

    const data = competitions.map((comp) => {
      const juaraList = comp.Achievement.map((ach) => ({
        name: ach.Student.User.Name,
        studentId: ach.Student.Id,
        school: ach.Student.School.Name,
        class: ach.Student.Class,
        stage: ach.Student.Stage,
        category: ach.Category ?? '',
        score: comp.CompetitionParticipant.find((cp) => cp.StudentId === ach.StudentId)?.Score ?? 0,
        certifNumber: comp.Achievement.find((cp) => cp.StudentId === ach.StudentId)?.SertifNumber ?? 0,
      }));

      // Urutkan juara dalam setiap kompetisi
      juaraList.sort((a, b) => {
        const orderA = juaraOrder[a.category] ?? 999;
        const orderB = juaraOrder[b.category] ?? 999;
        return orderA - orderB;
      });

      return {
        idCompetition: comp.Id,
        name: comp.Name,
        level: comp.Level,
        stage: comp.Stage,
        region: comp.Region?.Name ?? null,
        date: comp.Date,
        location: comp.Location,
        subject: comp.Subject?.Name ?? '-',
        winner: juaraList,
      };
    });

    data.sort((a, b) => {
      const subjectA = subjectOrder[a.subject] ?? 999;
      const subjectB = subjectOrder[b.subject] ?? 999;
      if (subjectA !== subjectB) return subjectA - subjectB;

      const stageA = stageOrder[a.stage] ?? 999;
      const stageB = stageOrder[b.stage] ?? 999;
      return stageA - stageB;
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success Get Winner',
      data: data,
    });
  }
  // #endRegion
}
