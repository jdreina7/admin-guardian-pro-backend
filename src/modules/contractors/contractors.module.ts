import { Module, forwardRef } from '@nestjs/common';
import { ContractorsService } from './contractors.service';
import { ContractorsController } from './contractors.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Contractor, ContractorSchema } from './schemas/contractor.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { LoginModule } from '../login/login.module';

@Module({
  controllers: [ContractorsController],
  providers: [ContractorsService],
  imports: [
    forwardRef(() => LoginModule),
    UsersModule,
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
  exports: [ContractorsService],
})
export class ContractorsModule {}
