import { Module } from '@nestjs/common';
import { IdentificationsService } from './identification.service';
import { IdentificationsController } from './identification.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Identification, IdentificationSchema } from './schemas/identification.schema';

@Module({
  controllers: [IdentificationsController],
  providers: [IdentificationsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Identification.name,
        schema: IdentificationSchema,
      },
    ]),
  ],
})
export class IdentificationsModule {}
