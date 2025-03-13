import { HttpException, Injectable } from '@nestjs/common';
import * as dayjs from 'dayjs';
import * as bcryptjs from 'bcryptjs';
import slugify from 'slugify';
import { ConfigService } from '@nestjs/config';
import * as sharp from 'sharp';
// import * as fs from 'fs';
import * as mime from 'mime-types';
import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from './prisma.service';

@Injectable()
export class UtilityService {
  constructor(
    private readonly configService: ConfigService,
    private prismaService: PrismaService,
  ) {}
  public allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet',
    'application/vnd.oasis.opendocument.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/svg+xml',
    'audio/mpeg',
    'audio/wav',
    'audio/aac',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'text/html',
    'text/css',
    'application/javascript',
    'text/markdown',
    'application/eps',
    'application/rtf',
    //
  ];

  public generateInvoice() {
    const prefix = 'INV';
    const date = dayjs().format('YYYYMMDD');
    const random = Math.floor(Math.random() * 1000000);
    const invoiceNumber = `${prefix}${date}-${random}`;
    return invoiceNumber;
  }

  public generateRandomPassword(length: number = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
    return password;
  }

  public getEpoch(date: Date = new Date()): number {
    return Math.floor(date.getTime() / 1000);
  }

  public async generateParticipantId(competitionId: string, studentId: string): Promise<string> {
    const competition = await this.prismaService.competition.findUnique({
      where: { Id: competitionId },
      include: { Season: true, Region: true, Subject: true },
    });

    const student = await this.prismaService.student.findUnique({
      where: { Id: studentId },
    });

    let codeClass = '0';
    if (student.Stage.toLowerCase() === 'sd') {
      codeClass = student.Class;
    } else if (student.Stage.toLowerCase() === 'smp') {
      const smpClassMap: Record<string, string> = {
        '1': '7',
        '2': '8',
        '3': '9',
      };
      codeClass = smpClassMap[student.Class] || '7';
    }

    if (!competition) throw new Error('Competition not found');
    // const seasonCode = competition.Season.Name.substring(0, 1);
    const regionCode = competition.Region.Region.toString().padStart(2, '0');
    const subjectMap: Record<string, string> = {
      matematika: 'M',
      ipa: 'S',
      ips: 'I',
      'bahasa inggris': 'B',
    };
    const subjectCode = subjectMap[competition.Subject.Name] || 'X';

    const count = await this.prismaService.competitionParticipant.count({
      where: {
        Competition: {
          Id: competitionId,
        },
      },
    });

    const participantNumber = (count + 1).toString().padStart(4, '0');
    return `${subjectCode}${codeClass}-${regionCode}-${participantNumber}`;
  }

  public generateId() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return `${dayjs().unix()}${result}`;
  }

  public generateSlugId() {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz1234567890';

    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }

    return result;
  }

  public generateUuid() {
    const uuid = uuidv4();
    const noDashes = uuid.replace(/-/g, '');
    return noDashes.slice(0, 20);
  }

  public validatePassword(password: string): string | null {
    // Regular expressions for password validation
    const minLength = 8;
    // const upperCaseRegex = /[A-Z]/;
    const lowerCaseRegex = /[a-z]/;
    const digitRegex = /\d/;
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;

    // Check for minimum length
    if (password.length < minLength) {
      return 'Password must be at least 8 characters long';
    }

    // Check for uppercase letter
    // if (!upperCaseRegex.test(password)) {
    //   return 'Password must contain at least one uppercase letter';
    // }

    // Check for lowercase letter
    if (!lowerCaseRegex.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }

    // Check for digit
    if (!digitRegex.test(password)) {
      return 'Password must contain at least one digit';
    }

    // Check for special character
    if (!specialCharRegex.test(password)) {
      return 'Password must contain at least one special character ($@$!%*?&)';
    }

    return null;
  }

  public hashPassword(password: string): string {
    const salt = bcryptjs.genSaltSync(10);
    const hash = bcryptjs.hashSync(password, salt);
    return hash;
  }

  public comparePassword(password: string, hashed: string): boolean {
    return bcryptjs.compareSync(password, hashed);
  }

  public globalResponse<T>({ statusCode = 200, message = null, data = null, res = null }: { res?: Response; data?: T; message?: string; statusCode?: number }) {
    if (statusCode >= 400) {
      throw new HttpException({ statusCode, message, data }, statusCode);
    }
    if (res) {
      return res.status(statusCode).json({ statusCode, message, data });
    }
    return { statusCode, message, data };
  }

  public skip(page: number, totalPage: number) {
    return (page - 1) * totalPage;
  }

  public slugify(text: string) {
    const cleanedText = text.replace(/[^a-zA-Z0-9 ]/g, '-');
    return slugify(cleanedText, { lower: true, strict: true }).replaceAll('_', '-');
  }

  public async resizeImage(buffer: Buffer, options: sharp.ResizeOptions = { width: 1920, height: 1080, fit: 'cover' }) {
    const { width, height } = await sharp(buffer).metadata();
    if (width <= options.width && height <= options.height) return buffer;
    return await sharp(buffer).resize(options).toBuffer();
  }

  public getExtension(mimeType: string) {
    return mime.extension(mimeType);
  }
}
