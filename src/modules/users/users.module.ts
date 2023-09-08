import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Rol, RolSchema } from '../roles/schemas/role.schema';
import { MaritalStatus, MaritalStatusSchema } from '../marital-statuses/schemas/marital-status.schema';
import { Ocupation, OcupationSchema } from '../ocupations/schemas/ocupation.schema';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Rol.name,
        schema: RolSchema,
      },
      {
        name: MaritalStatus.name,
        schema: MaritalStatusSchema,
      },
      {
        name: Ocupation.name,
        schema: OcupationSchema,
      },
    ]),
  ],
})
export class UsersModule {}
