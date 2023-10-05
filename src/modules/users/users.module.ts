import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './schemas/user.schema';
import { Rol, RolSchema } from '../roles/schemas/role.schema';
import { MaritalStatus, MaritalStatusesSchema } from '../marital-statuses/schemas/marital-status.schema';
import { Ocupation, OcupationSchema } from '../ocupations/schemas/ocupation.schema';
import { MaritalStatusesModule } from '../marital-statuses/marital-statuses.module';
import { OcupationsModule } from '../ocupations/ocupations.module';
import { RolesModule } from '../roles/roles.module';
import { Gender, GenderSchema } from '../genders/schemas/gender.schema';
import { GendersModule } from '../genders/genders.module';
import { IdentificationsTypesModule } from '../identificationsTypes/identificationTypes.module';
import {
  IdentificationTypes,
  IdentificationTypesSchema,
} from '../identificationsTypes/schemas/identificationTypes.schema';
import { LoginModule } from '../login/login.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    forwardRef(() => LoginModule),
    MaritalStatusesModule,
    OcupationsModule,
    forwardRef(() => RolesModule), // Previniendo la dependencia circular entre usuarios y roles
    GendersModule,
    IdentificationsTypesModule,
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
      {
        name: Gender.name,
        schema: GenderSchema,
      },
      {
        name: IdentificationTypes.name,
        schema: IdentificationTypesSchema,
      },
    ]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
