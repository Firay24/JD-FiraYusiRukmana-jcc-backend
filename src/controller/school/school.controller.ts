import { BadRequestException, Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { Request } from 'express';
import { StageType, StatusSchool, Subdistrict } from '@prisma/client';
import { SchoolSaveDto } from 'src/types/controller/school/school.dto';

@Controller()
@UseGuards(RolesGuard)
export class SchoolController {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly utilityService: UtilityService,
  ) {}

  // #region save
  @Post('save')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.SUPERADMIN])
  async save(@Req() request: Request, @Body() body: SchoolSaveDto) {
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

    const dbSchool = await this.prismaService.school.findFirst({
      where: { Id: body.id ?? '' },
    });
    const excitingSchool = await this.prismaService.school.findFirst({
      where: { Name: body.name ?? '' },
    });

    if (excitingSchool) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'School already exist',
        }),
      );
    }

    const schoolId = dbSchool ? dbSchool.Id : this.utilityService.generateUuid();

    const school = await this.prismaService.school.upsert({
      where: { Id: schoolId },
      update: {
        Id: schoolId,
        Name: body.name,
        Stage: body.stage as StageType,
        Subdistrict: body.subdistrict as Subdistrict,
        Status: body.status as StatusSchool,
        Ward: body.ward,
      },
      create: {
        Id: schoolId,
        Name: body.name,
        Stage: body.stage as StageType,
        Subdistrict: body.subdistrict as Subdistrict,
        Status: body.status as StatusSchool,
        Ward: body.ward,
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: `Success ${body.id ? 'Update' : 'Create'} School`,
      data: { id: school.Id },
    });
  }
  // #endRegion

  // #region list
  @Get('list')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async list(@Req() request: Request, @Query('stage') stage: StageType) {
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

    const schoolDb = await this.prismaService.school.findMany({
      where: { Stage: stage },
    });

    if (!schoolDb) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Payment not found',
        }),
      );
    }

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: schoolDb.map((school) => ({
        id: school.Id,
        name: school.Name,
      })),
    });
  }
  // #endregion
}
