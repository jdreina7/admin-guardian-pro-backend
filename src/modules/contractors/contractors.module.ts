import { Module } from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { ContractorsController } from './contractors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contractor, ContractorSchema } from './schemas/contractor.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

@Module({
  controllers: [ContractorsController],
  providers: [ContractorsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Contractor.name,
        schema: ContractorSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
})
export class ContractorsModule {}
