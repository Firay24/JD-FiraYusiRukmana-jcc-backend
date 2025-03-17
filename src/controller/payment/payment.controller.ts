import { BadRequestException, Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { Request } from 'express';
import { PaymentSaveDto } from 'src/types/controller/payment/payment.dto';

@Controller()
@UseGuards(RolesGuard)
export class PaymentController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  // #region getall by id
  @Get('user')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async getall(@Req() request: Request) {
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

    const dbStudent = await this.prismaService.student.findFirst({
      where: { IdUser: user.id },
    });

    if (!dbStudent) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Payment not found',
        }),
      );
    }

    const dbCompetitionParticipant = await this.prismaService.competitionParticipant.findMany({
      where: { StudentId: dbStudent.Id },
      include: { Payment: true },
    });

    const uniquePayments = new Map();

    dbCompetitionParticipant.forEach((participant) => {
      const payment = participant.Payment;
      if (payment && !uniquePayments.has(payment.Invoice)) {
        uniquePayments.set(payment.Invoice, {
          id: payment.Id,
          invoice: payment.Invoice,
          date: payment.Date,
          amount: payment.Amount,
          status: payment.Status,
        });
      }
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: Array.from(uniquePayments.values()),
    });
  }
  // #endregion

  // #region get kolektif
  @Get('kolektif')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async getAllByKolektif(@Req() request: Request) {
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

    const dbPayment = await this.prismaService.payment.findMany({
      where: { UserId: user.id },
      include: { PaymentStatusHistory: { orderBy: { Date: 'desc' } }, CompetitionParticipant: { include: { Competition: { include: { Season: true, Subject: true, Region: true } } } } },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Success',
      data: dbPayment.map((payment) => ({
        id: payment.Id,
        invoice: payment.Invoice,
        date: payment.Date,
        amount: payment.Amount,
        status: payment.Status,
      })),
    });
  }
  // #endregion

  // #region get by id
  @Get('get/:id')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async get(@Req() request: Request, @Param('id') id: string) {
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

    const dbPayment = await this.prismaService.payment.findFirst({
      where: { Id: id },
      include: { PaymentStatusHistory: { orderBy: { Date: 'desc' } }, CompetitionParticipant: { include: { Competition: { include: { Season: true, Subject: true, Region: true } } } } },
    });

    if (!dbPayment) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Payment not found',
        }),
      );
    }

    // const competiiton = dbPayment.CompetitionParticipant[0].Competition;
    const latestStatusHistory = dbPayment.PaymentStatusHistory[0];

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Payment found',
      data: {
        id: dbPayment.Id,
        invoice: dbPayment.Invoice,
        date: dbPayment.Date,
        amount: dbPayment.Amount,
        status: dbPayment.Status,
        competition: dbPayment.CompetitionParticipant.map((participant) => ({
          id: participant.Competition?.Id ?? null,
          name: participant.Competition?.Name ?? '',
          price: participant.Competition?.Price ?? 0,
          stage: participant.Competition.Stage,
          level: participant.Competition.Level,
          season: {
            id: participant.Competition?.Season?.Id ?? null,
            name: participant.Competition?.Season?.Name ?? '',
          },
          subject: {
            id: participant.Competition?.Subject?.Id ?? null,
            name: participant.Competition?.Subject?.Name ?? '',
          },
          region: {
            id: participant.Competition?.Region?.Id ?? null,
            name: participant.Competition?.Region?.Name ?? '',
          },
        })),
        detailStatus: dbPayment.PaymentStatusHistory.map((history) => ({
          status: history.Status,
          date: history.Date,
        })),
        latestStatus: {
          status: latestStatusHistory.Status,
          date: latestStatusHistory.Date,
        },
      },
    });
  }
  // #endregion

  // #region Payment
  @Put('update/:id')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async save(@Req() request: Request, @Param('id') id: string, @Body() body: PaymentSaveDto) {
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

    const dbPayment = await this.prismaService.payment.findFirst({
      where: { Id: id },
    });

    if (!dbPayment) {
      throw new BadRequestException(
        this.utilityService.globalResponse({
          statusCode: 400,
          message: 'Payment not found',
        }),
      );
    }

    const payment = await this.prismaService.payment.update({
      where: { Id: id },
      data: {
        Invoice: body.invoice ?? dbPayment.Invoice,
        Date: body.date ?? dbPayment.Date,
        Amount: body.amount ?? dbPayment.Amount,
        Status: body.status ?? dbPayment.Status,
      },
    });

    await this.prismaService.paymentStatusHistory.create({
      data: {
        Id: this.utilityService.generateUuid(),
        PaymentId: payment.Id,
        Status: body.status ?? dbPayment.Status,
        Date: this.utilityService.getEpoch(new Date()),
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'Payment Updated Successfully',
      data: { id: payment.Id },
    });
  }
  // #endregion
}
