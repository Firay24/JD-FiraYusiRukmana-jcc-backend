import { BadRequestException, Body, Controller, Get, Param, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { EventSaveDto } from 'src/types/controller/event/event.dto';
import { Request } from 'express';
import { StageType } from '@prisma/client';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { PdfServiceController } from '../pdf-service/pdf-service.controller';
import * as path from 'path';
import * as fs from 'fs';
import { Response } from 'express';

@Controller()
@UseGuards(RolesGuard)
export class EventController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
    private pdfService: PdfServiceController,
  ) {}

  // #region search
  @Get('search')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.PARTISIPANT, Role.FACILITATOR])
  async search(@Req() request: Request, @Query('stage') stage: string, @Query('level') level: string, @Query('subjectId') subjectId: string) {
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
      where: { Stage: stage as StageType, Level: parseInt(level, 10), SubjectId: subjectId },
    });

    if (!dbEvent) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Event not found',
        }),
      );
    }

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        id: dbEvent ? dbEvent.Id : '',
      },
    });
  }
  // #endregion

  // #region list
  @Get('list')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.PARTISIPANT, Role.FACILITATOR])
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

    limit = Math.max(1, Math.min(limit, 100));

    const skip = (page - 1) * limit;
    const totalItems = await this.prismaService.competition.count();
    const totalPages = Math.ceil(totalItems / limit);

    const dbEvent = await this.prismaService.competition.findMany({
      skip,
      take: limit,
      include: { Season: true, Subject: true },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        currentPage: page,
        totalPages,
        totalItems,
        competitions: dbEvent.map((event) => ({
          name: event.Name,
          description: event.Description,
          date: event.Date,
          level: event.Level,
          stage: event.Stage,
          price: event.Price,
          location: event.Location,
          season: event.Season.Name,
          subjectId: event.Subject.Name,
        })),
      },
    });
  }
  // #endregion

  // #region detail
  @Get('detail/:id')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.PARTISIPANT, Role.FACILITATOR])
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

    const dbEvent = await this.prismaService.competition.findFirst({
      where: { Id: id },
      include: { Season: true, Subject: true, Kisi: true },
    });

    if (!dbEvent) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Event not found',
        }),
      );
    }

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        id: dbEvent.Id,
        name: dbEvent.Name,
        description: dbEvent.Description,
        date: dbEvent.Date,
        level: dbEvent.Level,
        stage: dbEvent.Stage,
        price: dbEvent.Price,
        location: dbEvent.Location,
        season: dbEvent.Season.Name,
        subjectId: dbEvent.Subject.Name,
        kisi: dbEvent.Kisi.map((kisi) => ({
          id: kisi.Id,
          name: kisi.Content,
        })),
      },
    });
  }
  // #endregion

  // #region save
  @Post('save')
  @Roles([Role.SUPERADMIN, Role.ADMIN])
  async save(@Req() request: Request, @Body() body: EventSaveDto) {
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
      where: { Id: body.id ?? '' },
    });

    const eventId = dbEvent ? dbEvent.Id : this.utilityService.generateUuid();

    const event = await this.prismaService.competition.upsert({
      where: { Id: eventId },
      update: {
        Id: eventId,
        Name: body.name,
        Description: body.description,
        Date: body.date,
        Level: body.level,
        Stage: body.stage,
        Price: body.price,
        RegionId: body.regionId,
        Location: body.location,
        SeasonId: body.seasonId,
        SubjectId: body.subjectId,
        CodePackage: body.codePackage ?? null,
        PathAnswer: body.pathAnswer ?? null,
      },
      create: {
        Id: eventId,
        Name: body.name,
        Description: body.description,
        Date: body.date,
        Level: body.level,
        Stage: body.stage,
        Price: body.price,
        RegionId: body.regionId,
        Location: body.location,
        SeasonId: body.seasonId,
        SubjectId: body.subjectId,
        CodePackage: body.codePackage ?? null,
        PathAnswer: body.pathAnswer ?? null,
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: `Success ${body.id ? 'Update' : 'Create'} Student`,
      data: { id: event.Id },
    });
  }
  // #endRegion
  // #region pdf
  @Post('upload/:competitionId')
  @Roles([Role.SUPERADMIN, Role.ADMIN])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './students_pdfs',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
  async uploadPdf(@UploadedFile() file: Express.Multer.File, @Param('competitionId') competitionId: string) {
    await this.pdfService.processPdf(file.path, competitionId);
    return { message: 'PDF successfully' };
  }
  // #endregion

  // #region getpdf
  @Get('getpdf/:competitionId/:filename')
  async getPdf(@Param('competitionId') competitionId: string, @Param('filename') filename: string, @Res() res: Response) {
    // Ambil data kompetisi untuk mendapatkan nama folder
    const competition = await this.prismaService.competition.findUnique({
      where: { Id: competitionId },
      select: { Subject: true, Stage: true, Level: true },
    });

    if (!competition) {
      return res.status(404).send('Competition not found');
    }

    // Buat nama folder berdasarkan subject-stage-level
    const folderName = `${competition.Subject.Name}-${competition.Stage}-${competition.Level}`;
    const filePath = path.join(process.cwd(), 'students_pdfs', folderName, filename);

    // Cek apakah file ada di path yang benar
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    } else {
      return res.status(404).send('File not found');
    }
  }

  /// #endregion
}
