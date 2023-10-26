import { Module, forwardRef } from '@nestjs/common';
import { OcupationsService } from './ocupations.service';
import { OcupationsController } from './ocupations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ocupation, OcupationSchema } from './schemas/ocupation.schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [OcupationsController],
  providers: [OcupationsService],
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: Ocupation.name,
        schema: OcupationSchema,
      },
    ]),
  ],
  exports: [OcupationsService],
})
export class OcupationsModule {}
