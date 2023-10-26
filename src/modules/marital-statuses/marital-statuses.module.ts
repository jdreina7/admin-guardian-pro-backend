import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MaritalStatusesService } from './marital-statuses.service';
import { MaritalStatusesController } from './marital-statuses.controller';
import { MaritalStatus, MaritalStatusesSchema } from './schemas/marital-status.schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [MaritalStatusesController],
  providers: [MaritalStatusesService],
  imports: [
    forwardRef(() => UsersModule),
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
