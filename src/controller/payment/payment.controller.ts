import { BadRequestException, Body, Controller, Param, Put, Req, UseGuards } from '@nestjs/common';
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
        Date: new Date(body.date) ?? dbPayment.Date,
        Amount: body.amount ?? dbPayment.Amount,
        Status: body.status ?? dbPayment.Status,
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
