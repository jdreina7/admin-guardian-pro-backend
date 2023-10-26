import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IdentificationsTypesService } from './identificationTypes.service';
import { IdentificationsTypesController } from './identificationTypes.controller';
import { IdentificationTypes, IdentificationTypesSchema } from './schemas/identificationTypes.schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [IdentificationsTypesController],
  providers: [IdentificationsTypesService],
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: IdentificationTypes.name,
        schema: IdentificationTypesSchema,
      },
    ]),
  ],
  exports: [IdentificationsTypesService],
})
export class IdentificationsTypesModule {}
