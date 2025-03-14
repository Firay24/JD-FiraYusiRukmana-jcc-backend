import { Module } from '@nestjs/common';
import { RegionalController } from './regional.controller';

@Module({
  controllers: [RegionalController],
})
export class RegionalModule {}
