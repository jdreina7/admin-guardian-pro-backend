import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { GendersService } from './genders.service';
import { GendersController } from './genders.controller';
import { Gender, GenderSchema } from './schemas/gender.schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [GendersController],
  providers: [GendersService],
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: Gender.name,
        schema: GenderSchema,
      },
    ]),
  ],
  exports: [GendersService],
})
export class GendersModule {}
