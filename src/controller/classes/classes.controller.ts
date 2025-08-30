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

interface AssignRoomDto {
  competitionId: string;
  roomId: string;
  mode: string;
  startIndex: number;
  endIndex: number;
  idMembers: string[];
  newRoomName?: string;
}

@Controller()
@UseGuards(RolesGuard)
export class ClassesController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  // #region assign participants
  @Post('assign')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN])
  async assign(@Req() request: Request, @Body() body: AssignRoomDto) {
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

    let compRoom;

    // NEWROOM
    if (body.newRoomName) {
      const existingRoom = await this.prismaService.room.findFirst({
        where: {
          Name: body.newRoomName.toUpperCase(),
        },
      });

      if (existingRoom) {
        throw new Error(`Room ${body.newRoomName.toUpperCase()} already exists`);
      }

      const newRoom = await this.prismaService.room.create({
        data: {
          Id: this.utilityService.generateUuid(),
          Name: body.newRoomName.toUpperCase(),
        },
      });

      compRoom = await this.prismaService.competitionRoom.create({
        data: {
          Id: this.utilityService.generateUuid(),
          CompetitionId: body.competitionId,
          RoomId: newRoom.Id,
        },
      });
    } else {
      // room existing
      compRoom = await this.prismaService.competitionRoom.findFirst({
        where: {
          CompetitionId: body.competitionId,
          RoomId: body.roomId,
        },
      });

      if (!compRoom) {
        compRoom = await this.prismaService.competitionRoom.create({
          data: {
            Id: this.utilityService.generateUuid(),
            CompetitionId: body.competitionId,
            RoomId: body.roomId,
          },
        });
      }
    }

    // Search Participant
    let participants: any[] = [];

    if (body.mode === 'all') {
      participants = await this.prismaService.competitionParticipant.findMany({
        where: {
          CompetitionId: body.competitionId,
        },
      });
    } else if (body.mode === 'range') {
      if (body.startIndex === null || body.endIndex === null) {
        throw new BadRequestException(
          this.utilityService.globalResponse({
            statusCode: 400,
            message: 'Start index or end index is null',
          }),
        );
      }
      participants = await this.prismaService.competitionParticipant.findMany({
        where: {
          CompetitionId: body.competitionId,
        },
        orderBy: { DateCreate: 'asc' },
        skip: body.startIndex - 1,
        take: body.endIndex - body.startIndex + 1,
      });
      console.log(body.startIndex, body.endIndex, participants.length);
    } else if (body.mode === 'members') {
      if (!body.idMembers || !Array.isArray(body.idMembers)) {
        throw new BadRequestException('idMembers is required for members mode');
      }
      participants = await this.prismaService.competitionParticipant.findMany({
        where: {
          CompetitionId: body.competitionId,
          Student: {
            IdMember: { in: body.idMembers },
          },
        },
        include: { Student: true },
      });
    } else {
      throw new BadRequestException('Invalid mode');
    }

    // Update competition participant room
    await this.prismaService.competitionParticipant.updateMany({
      where: { Id: { in: participants.map((participant) => participant.Id) } },
      data: { CompetitionRoomId: compRoom.Id },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: {
        competitionRoomId: compRoom.Id,
        assigned: participants.length,
      },
    });
  }
  // #endregion

  // #region list
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
  // #endregion

  // #region save
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
  // #endregion

  // #region save room participant
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
  // #endregion
}
