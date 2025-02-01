import { BadRequestException, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { Request } from 'express';

@Controller()
@UseGuards(RolesGuard)
export class SubjectController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  // #region list
  @Get('list')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT])
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

    const dbSubject = await this.prismaService.subject.findMany();

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: dbSubject.map((subject) => ({
        id: subject.Id,
        name: subject.Name,
      })),
    });
  }
  // #endregion
}
