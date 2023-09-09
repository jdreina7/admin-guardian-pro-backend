import { Module } from '@nestjs/common';
import { MaritalStatusesService } from './marital-statuses.service';
import { MaritalStatusesController } from './marital-statuses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MaritalStatus, MaritalStatusesSchema } from './schemas/marital-status.schema';

@Module({
  controllers: [MaritalStatusesController],
  providers: [MaritalStatusesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: MaritalStatus.name,
        schema: MaritalStatusesSchema,
      },
    ]),
  ],
  exports: [MaritalStatusesService],
})
export class MaritalStatusesModule {}
