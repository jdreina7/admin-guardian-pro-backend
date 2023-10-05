import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LoginModule } from '../login/login.module';

import { GendersService } from './genders.service';
import { GendersController } from './genders.controller';
import { Gender, GenderSchema } from './schemas/gender.schema';

@Module({
  controllers: [GendersController],
  providers: [GendersService],
  imports: [
    forwardRef(() => LoginModule), // Previniendo la dependencia circular entre usuarios y roles
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
