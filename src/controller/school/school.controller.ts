import { BadRequestException, Body, Controller, Get, Post, Query, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { Request } from 'express';
import { StageType, StatusSchool } from '@prisma/client';
import { SchoolSaveDto } from 'src/types/controller/school/school.dto';
import * as fs from 'fs';
import * as xlsx from 'xlsx';
import * as path from 'path';
import { diskStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';

interface ExcelRow {
  nama: string;
  alamat: string;
  status: string;
  kecamatan: string;
  jenjang: string;
}

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
        Subdistrict: body.subdistrict,
        Status: body.status as StatusSchool,
        Ward: body.ward,
      },
      create: {
        Id: schoolId,
        Name: body.name,
        Stage: body.stage as StageType,
        Subdistrict: body.subdistrict,
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

    const whereCondition = stage ? { OR: [{ Stage: stage }, { Stage: StageType.LEMBAGA }] } : { Stage: StageType.LEMBAGA };

    const schoolDb = await this.prismaService.school.findMany({
      where: whereCondition,
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

  // #region save-batch
  @Post('batch-save')
  @Roles([Role.SUPERADMIN, Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + path.extname(file.originalname));
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(xlsx|xls)$/)) {
          return cb(new BadRequestException('Only Excel files are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() request: Request) {
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

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = path.join(process.cwd(), 'uploads', file.filename);
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const data: ExcelRow[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    fs.unlinkSync(filePath);

    for (const row of data) {
      const existingSchool = await this.prismaService.school.findFirst({
        where: {
          Name: row.nama,
        },
      });

      let nameSchool: string;
      if (existingSchool) {
        nameSchool = row.nama + ' ' + row.kecamatan;
      } else {
        nameSchool = row.nama;
      }

      await this.prismaService.school.create({
        data: {
          Id: this.utilityService.generateUuid(),
          Name: nameSchool.toUpperCase(),
          Stage: row.jenjang as StageType,
          Subdistrict: row.kecamatan,
          Status: row.status as StatusSchool,
          Ward: row.alamat,
        },
      });
    }

    return {
      message: 'Successfully',
      data: {
        total: data.length,
      },
    };
  }
  // #endregion
}
