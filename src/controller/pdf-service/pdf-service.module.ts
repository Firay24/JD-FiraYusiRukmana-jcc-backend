import { Module } from '@nestjs/common';
import { PdfServiceController } from './pdf-service.controller';
// import { PrismaService } from 'src/services/prisma.service';

@Module({
  controllers: [PdfServiceController],
  providers: [PdfServiceController],
  exports: [PdfServiceController],
})
export class PdfServiceModule {}
