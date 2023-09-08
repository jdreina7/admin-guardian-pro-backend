import { Module } from '@nestjs/common';
import { MaritalStatusesService } from './marital-statuses.service';
import { MaritalStatusesController } from './marital-statuses.controller';

@Module({
  controllers: [MaritalStatusesController],
  providers: [MaritalStatusesService],
})
export class MaritalStatusesModule {}
