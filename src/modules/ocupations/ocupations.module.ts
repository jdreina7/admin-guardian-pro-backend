import { Module } from '@nestjs/common';
import { OcupationsService } from './ocupations.service';
import { OcupationsController } from './ocupations.controller';

@Module({
  controllers: [OcupationsController],
  providers: [OcupationsService],
})
export class OcupationsModule {}
