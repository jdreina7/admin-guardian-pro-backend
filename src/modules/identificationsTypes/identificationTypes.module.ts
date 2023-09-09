import { Module } from '@nestjs/common';
import { IdentificationsTypesService } from './identificationTypes.service';
import { IdentificationsTypesController } from './identificationTypes.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { IdentificationTypes, IdentificationTypesSchema } from './schemas/identificationTypes.schema';

@Module({
  controllers: [IdentificationsTypesController],
  providers: [IdentificationsTypesService],
  imports: [
    MongooseModule.forFeature([
      {
        name: IdentificationTypes.name,
        schema: IdentificationTypesSchema,
      },
    ]),
  ],
})
export class IdentificationsTypesModule {}
