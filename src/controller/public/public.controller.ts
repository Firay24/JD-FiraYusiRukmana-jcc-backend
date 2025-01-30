import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';

@Controller()
export class PublicController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  @Get('role/list')
  async list() {
    const dbRole = await this.prismaService.role.findMany();

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: dbRole.map((role) => ({
        id: role.Id,
        name: role.Name,
      })),
    });
  }
}
