import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { PdfServiceModule } from '../pdf-service/pdf-service.module';

@Module({
  imports: [PdfServiceModule],
  controllers: [EventController],
})
export class EventModule {}
