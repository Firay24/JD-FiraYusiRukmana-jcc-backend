import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';

import { UtilityService } from 'src/services/utility.service';
import { PrismaService } from 'src/services/prisma.service';
import { JwtService } from 'src/services/jwt.service';
import { AuthDto } from 'src/types/auth/auth.dto';
import { Request, Response } from 'express';
import { JwtDto } from 'src/types/auth/jwt.dto';
import * as dayjs from 'dayjs';

@Controller()
export class AuthController {
  constructor(
    private prismaService: PrismaService,
    private utilityService: UtilityService,
    private jwtService: JwtService,
  ) {}

  // #region sign-in
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() body: AuthDto, @Res() res: Response) {
    let { username, password } = body;
    username = username.trim().toLowerCase();
    password = password.trim();

    const user = await this.prismaService.user.findFirst({
      where: { Username: username },
      include: { Role: true },
    });
    if (!user)
      return this.utilityService.globalResponse({
        statusCode: 404,
        message: 'User not found',
      });

    const isPasswordValid = this.utilityService.comparePassword(password, user.Password);
    if (!isPasswordValid)
      return this.utilityService.globalResponse({
        statusCode: 400,
        message: 'Password Invalid',
      });

    const token = this.jwtService.generateTokens({
      id: user.Id,
      username,
      role: {
        id: user.Role.Id,
        name: user.Role.Name,
      },
    });

    this.jwtService.setTokenCookie(res, JSON.stringify(token));

    return this.utilityService.globalResponse({
      res,
      statusCode: 200,
      message: 'Sign in successfully',
      data: {
        id: user.Id,
        username: user.Username,
        role: {
          id: user.Role.Id,
          name: user.Role.Name,
        },
      },
    });
  }
  // #endregion

  // #region sign-out
  @Post('sign-out')
  async signOut(@Res() res: Response) {
    this.jwtService.clearTokenCookie(res);

    return this.utilityService.globalResponse({
      res,
      statusCode: 200,
      message: 'Sign out successfully',
    });
  }

  // #endregion

  // #region sign-up
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  async signUp(@Body() body: AuthDto) {
    let { username, password, email, name, roleId, birthdate, gender, phoneNumber } = body;
    username = username.toLowerCase().trim();
    name = name.trim();
    email = email ? email.trim() : null;
    password = password ? password.trim() : this.utilityService.generateRandomPassword();
    roleId = roleId.trim();
    birthdate = birthdate;
    phoneNumber = phoneNumber.trim();
    gender = gender;

    if (!name)
      return this.utilityService.globalResponse({
        statusCode: 409,
        message: 'First Name cannot empty',
      });

    const dbUser = await this.prismaService.user.findFirst({
      where: { Username: username },
    });
    if (dbUser)
      return this.utilityService.globalResponse({
        statusCode: 409,
        message: 'Username already exists',
      });

    const messagePassword = this.utilityService.validatePassword(password);
    if (messagePassword)
      return this.utilityService.globalResponse({
        statusCode: 400,
        message: messagePassword,
      });

    const hashedPassword = this.utilityService.hashPassword(password);

    await this.prismaService.user.create({
      data: {
        Id: this.utilityService.generateId(),
        Name: name,
        Username: username,
        Email: email,
        Password: hashedPassword,
        RoleId: roleId,
        Birthdate: birthdate,
        Gender: gender,
        PhoneNumber: phoneNumber,
      },
    });

    return this.utilityService.globalResponse({
      statusCode: 201,
      message: 'User Created',
    });
  }
  // #endregion

  // #region logged
  @Get('logged')
  async logged(@Req() req: Request, @Res() res: Response) {
    // Ambil token dari cookie
    const jwtCookie = req.cookies?.jwt;

    // Jika tidak ada token, kembalikan respons error
    if (!jwtCookie) {
      return this.utilityService.globalResponse({
        res,
        statusCode: 401,
        // message: 'Not authenticated',
      });
    }

    try {
      // Parse cookie JSON jika diperlukan
      const { accessToken } = typeof jwtCookie === 'string' ? JSON.parse(jwtCookie) : jwtCookie;

      // Verifikasi token
      const decoded = this.jwtService.verifyAccessToken(accessToken);

      // Jika token tidak valid
      if (!decoded) {
        return this.utilityService.globalResponse({
          res,
          statusCode: 401,
          message: 'Invalid token',
        });
      }

      // Ambil pengguna berdasarkan ID dari token yang telah didekode
      const user = await this.prismaService.user.findFirst({
        where: { Id: decoded.id },
        include: { Role: true },
      });

      // Jika pengguna tidak ditemukan
      if (!user) {
        return this.utilityService.globalResponse({
          res,
          statusCode: 404,
          message: 'User not found',
        });
      }

      // Kembalikan data pengguna yang telah diautentikasi
      return this.utilityService.globalResponse({
        res,
        statusCode: 200,
        message: 'User authenticated',
        data: {
          id: user.Id,
          username: user.Username,
          email: user.Email,
          role: user.Role.Name,
          name: user.Name,
        },
      });
    } catch {
      // Jika terjadi error selama proses, kembalikan respons error
      return this.utilityService.globalResponse({
        res,
        statusCode: 401,
      });
    }
  }
  // #endregion

  // #region refresh
  @Post('refresh-token')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const jwt: JwtDto = JSON.parse(req.cookies.jwt ?? '{}');
    try {
      const decoded = this.jwtService.verifyRefreshToken(jwt.refreshToken);
      delete decoded.iat;
      delete decoded.exp;
      const token = this.jwtService.generateTokens(decoded);
      this.jwtService.setTokenCookie(res, JSON.stringify(token));

      return this.utilityService.globalResponse({
        res,
        statusCode: 200,
        message: 'Token Refreshed',
      });
    } catch (error) {
      console.log(dayjs().format('ddd DD-MM-YYYY HH:mm:ss') + ' - ' + error.message);
      throw this.utilityService.globalResponse({
        statusCode: 400,
        message: 'Refresh Token Invalid',
      });
    }
  }
  // #endregion
}
