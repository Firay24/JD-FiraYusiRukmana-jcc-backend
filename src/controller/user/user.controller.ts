import { BadRequestException, Body, Controller, Put, Req, UseGuards } from '@nestjs/common';
import { Roles } from 'src/guard/roles/roles.decorator';
import { Role } from 'src/guard/roles/roles.enum';
import { RolesGuard } from 'src/guard/roles/roles.guard';
import { PrismaService } from 'src/services/prisma.service';
import { UtilityService } from 'src/services/utility.service';
import { AuthDto } from 'src/types/auth/auth.dto';
import { Request } from 'express';

@Controller()
@UseGuards(RolesGuard)
export class UserController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
  ) {}

  @Put('update')
  @Roles([Role.ADMIN, Role.EVENTADMIN, Role.FACILITATOR, Role.PARTISIPANT, Role.SUPERADMIN])
  async update(@Req() request: Request, @Body() body: AuthDto) {
    const { id, username, password, email, name, roleId, birthdate, gender, phoneNumber } = body;
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

    let updatedPassword = dbUser.Password;
    if (password) {
      const messagePassword = this.utilityService.validatePassword(password);
      if (messagePassword)
        return this.utilityService.globalResponse({
          statusCode: 400,
          message: messagePassword,
        });

      updatedPassword = this.utilityService.hashPassword(password);
    }

    const updatedUser = await this.prismaService.user.update({
      where: { Id: id ?? user.id },
      data: {
        Name: name?.trim() || dbUser.Name,
        Username: username?.trim() || dbUser.Username,
        Email: email?.trim() || dbUser.Email,
        Password: updatedPassword,
        RoleId: roleId?.trim() || dbUser.RoleId,
        Birthdate: birthdate ? new Date(birthdate) : dbUser.Birthdate,
        Gender: gender || dbUser.Gender,
        PhoneNumber: phoneNumber?.trim() || dbUser.PhoneNumber,
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 200,
      message: 'User Updated Successfully',
      data: { id: updatedUser.Id },
    });
  }
}
