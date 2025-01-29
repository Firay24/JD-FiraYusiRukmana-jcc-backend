import { BadRequestException, Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { EventSaveDto } from 'src/types/controller/event/event.dto';
import { Request } from 'express';

@Controller()
@UseGuards(RolesGuard)
export class EventController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

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
        Date: new Date(body.date),
        Level: body.level,
        Stage: body.stage,
        Price: body.price,
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
        Date: new Date(body.date),
        Level: body.level,
        Stage: body.stage,
        Price: body.price,
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
}
