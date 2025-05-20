import { Controller, UseGuards } from '@nestjs/common';
// import { Request } from 'express';
// import { Roles } from 'src/guard/roles/roles.decorator';
// import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';

// interface ClassesSaveDto {
//   id?: string;
//   name: string;
//   competitionId: string;
// }

@Controller()
@UseGuards(RolesGuard)
export class ClassesController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  // @Post('save')
  // @Roles([Role.SUPERADMIN, Role.ADMIN])
  // async save(@Req() request: Request, @Body() body: ClassesSaveDto) {
  //   const user = request.user;
  //   const dbUser = await this.prismaService.user.findFirst({
  //     where: { Id: user.id },
  //     include: { Role: true },
  //   });

  //   if (!dbUser) {
  //     throw new BadRequestException(
  //       this.utilityService.globalResponse({
  //         statusCode: 400,
  //         message: 'User not found',
  //       }),
  //     );
  //   }

  //   const dbRoom = await this.prismaService.competitionRoom.findFirst({
  //     where: { Id: body.id ?? '' },
  //   });

  //   const roomId = dbRoom ? dbRoom.Id : this.utilityService.generateUuid();

  //   const room = await this.prismaService.competitionRoom.upsert({
  //     where: { Id: roomId },
  //     update: {
  //       Id: roomId,
  //       Name: body.name,
  //       CompetitionId: body.competitionId,
  //     },
  //     create: {
  //       Id: roomId,
  //       Name: body.name,
  //       CompetitionId: body.competitionId,
  //     },
  //   });

  //   return this.utilityService.globalResponse({
  //     statusCode: 200,
  //     message: `Success ${body.id ? 'Update' : 'Create'} Classes`,
  //     data: { id: room.Id },
  //   });
  // }
}
