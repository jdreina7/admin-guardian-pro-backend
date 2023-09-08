import { Module } from '@nestjs/common';
import { MaritalStatusesService } from './marital-statuses.service';
import { MaritalStatusesController } from './marital-statuses.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MaritalStatus, MaritalStatusSchema } from './schemas/marital-status.schema';

@Module({
  controllers: [MaritalStatusesController],
  providers: [MaritalStatusesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: MaritalStatus.name,
        schema: MaritalStatusSchema,
      },
    ]),
  ],
})
export class MaritalStatusesModule {}
