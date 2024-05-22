import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IdentificationsTypesService } from './identification-types.service';
import { IdentificationsTypesController } from './identification-types.controller';
import { IdentificationTypes, IdentificationTypesSchema } from './schemas/identification-types.schema';
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
