import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { CompetitionSaveDto } from 'src/types/controller/competition/competition.dto';
import { Request } from 'express';
// import * as fs from 'fs';
// import * as path from 'path';
// import { diskStorage } from 'multer';
// import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
@UseGuards(RolesGuard)
export class ActivityController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

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

    let paymentId = existingParticipant?.Payment?.Id;
    if (!paymentId) {
      const payment = await this.prismaService.payment.create({
        data: {
          Id: this.utilityService.generateUuid(),
          Invoice: this.utilityService.generateInvoice(),
          Date: new Date(),
          Amount: dbEvent.Price,
          Status: 'PENDING',
        },
      });
      paymentId = payment.Id;
    }

    const dbCompetitionParticipant = await this.prismaService.competitionParticipant.findFirst({
      where: { Id: body.id ?? '' },
    });

    const competitionParticipantId = dbCompetitionParticipant ? dbCompetitionParticipant.Id : this.utilityService.generateUuid();

    const competition = await this.prismaService.competitionParticipant.upsert({
      where: { Id: competitionParticipantId },
      update: {
        Id: competitionParticipantId,
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
        StudentId: body.studentId,
        CompetitionId: body.competitionId,
        CompetitionRoomId: body.competitionRommId,
        PaymentId: paymentId,
        Attedance: body.attedance,
        Score: body.score,
        Correct: body.correct,
        Incorrect: body.incorrect,
        PathAnswer: body.pathAnswer,
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: `Success ${body.id ? 'Update' : 'Create'} Student`,
      data: { id: competition.Id },
    });
  }
  // #endregion

  // #region batch save
  // @Post('batch-save')
  // @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR])
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     storage: diskStorage({
  //       destination: './uploads',
  //       filename: (req, file, cb) => {
  //         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  //         cb(null, uniqueSuffix + path.extname(file.originalname));
  //       },
  //     }),
  //     fileFilter: (req, file, cb) => {
  //       if (!file.originalname.match(/\.(xlsx|xls)$/)) {
  //         return cb(new BadRequestException('Only Excel files are allowed'), false);
  //       }
  //       cb(null, true);
  //     },
  //   }),
  // )
  // async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('schoolId') schoolId: string, @Body('competitionId') competitionId: string) {
  //   if (!file) {
  //     throw new BadRequestException('No file uploaded');
  //   }

  //   return {
  //     message: 'Upload sukses',
  //   };
  // }
  // #endregion
}
