import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contractor, ContractorSchema } from '../contractors/schemas/contractor.schema';
import { ContractAppend, ContractAppendSchema } from '../contract-appends/schemas/contract-append.schema';
import { ContractorsModule } from '../contractors/contractors.module';
import { ContractAppendsModule } from '../contract-appends/contract-appends.module';
import { Contract, ContractSchema } from './schemas/contract.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [ContractsController],
  providers: [ContractsService],
  imports: [
    ContractorsModule,
    ContractAppendsModule,
    UsersModule,
    MongooseModule.forFeature([
      {
        name: Contractor.name,
        schema: ContractorSchema,
      },
      {
        name: ContractAppend.name,
        schema: ContractAppendSchema,
      },
      {
        name: Contract.name,
        schema: ContractSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [ContractsService],
})
export class ContractsModule {}
