import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { Rol, RolSchema } from '../roles/schemas/role.schema';
import { MaritalStatus, MaritalStatusesSchema } from '../marital-statuses/schemas/marital-status.schema';
import { Ocupation, OcupationSchema } from '../ocupations/schemas/ocupation.schema';
import { MaritalStatusesModule } from '../marital-statuses/marital-statuses.module';
import { OcupationsModule } from '../ocupations/ocupations.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MaritalStatusesModule,
    OcupationsModule,
    RolesModule,
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
        schema: MaritalStatusesSchema,
      },
      {
        name: Ocupation.name,
        schema: OcupationSchema,
      },
    ]),
  ],
})
export class UsersModule {}
