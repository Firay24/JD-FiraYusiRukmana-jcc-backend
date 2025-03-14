import { BadRequestException, Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';

@Controller()
@UseGuards(RolesGuard)
export class RegionalController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  @Get('list')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.PARTISIPANT, Role.FACILITATOR])
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

    const dbRegional = await this.prismaService.region.findMany();

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: dbRegional.map((regional) => ({
        id: regional.Id,
        name: regional.Name,
        region: regional.Region,
        regionDetail: regional.RegionDetail,
      })),
    });
  }
}
