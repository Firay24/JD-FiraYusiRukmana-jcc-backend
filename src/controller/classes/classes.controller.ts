import { BadRequestException, Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Request } from 'express';
// import { Roles } from 'src/guard/roles/roles.decorator';
// import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { Role } from 'src/guard/roles/roles.enum';

interface ClassesSaveDto {
  id?: string;
  name: string;
}

interface RoomSaveDto {
  id?: string;
  roomId: string;
  competitionId: string;
}

@Controller()
@UseGuards(RolesGuard)
export class ClassesController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  @Get('list')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN])
  async list(@Req() request: Request) {
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

    const dbRoom = await this.prismaService.room.findMany();

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: dbRoom.map((room) => ({
        id: room.Id,
        name: room.Name,
      })),
    });
  }

  @Post('save')
  @Roles([Role.SUPERADMIN, Role.ADMIN])
  async save(@Req() request: Request, @Body() body: ClassesSaveDto) {
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

    const dbRoom = await this.prismaService.room.findFirst({
      where: { Id: body.id ?? '' },
    });

    const roomId = dbRoom ? dbRoom.Id : this.utilityService.generateUuid();

    const room = await this.prismaService.room.upsert({
      where: { Id: roomId },
      update: {
        Id: roomId,
        Name: body.name,
      },
      create: {
        Id: roomId,
        Name: body.name,
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: `Success ${body.id ? 'Update' : 'Create'} Classes`,
      data: { id: room.Id },
    });
  }

  @Post('save/roomParticipant')
  @Roles([Role.SUPERADMIN, Role.ADMIN])
  async roomPArticipant(@Req() request: Request, @Body() body: RoomSaveDto) {
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

    const dbRoom = await this.prismaService.competitionRoom.findFirst({
      where: { Id: body.id ?? '' },
    });

    const roomId = dbRoom ? dbRoom.Id : this.utilityService.generateUuid();

    const room = await this.prismaService.competitionRoom.upsert({
      where: { Id: roomId },
      update: {
        Id: roomId,
        RoomId: body.roomId,
        CompetitionId: body.competitionId,
      },
      create: {
        Id: roomId,
        RoomId: body.roomId,
        CompetitionId: body.competitionId,
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: `Success ${body.id ? 'Update' : 'Create'} Room`,
      data: { id: room.Id },
    });
  }
}
