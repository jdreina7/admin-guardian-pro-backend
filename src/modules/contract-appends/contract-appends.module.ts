import { Module, forwardRef } from '@nestjs/common';
import { ContractAppendsService } from './contract-appends.service';
import { ContractAppendsController } from './contract-appends.controller';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ContractAppend, ContractAppendSchema } from './schemas/contract-append.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
// import { LoginModule } from '../login/login.module';

@Module({
  controllers: [ContractAppendsController],
  providers: [ContractAppendsService],
  imports: [
    // forwardRef(() => LoginModule),
    UsersModule,
    MongooseModule.forFeature([
      {
        name: ContractAppend.name,
        schema: ContractAppendSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [ContractAppendsService],
})
export class ContractAppendsModule {}
