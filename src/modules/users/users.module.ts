import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
// import { LoginModule } from '../login/login.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginService } from './login.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, LoginService],
  imports: [
    ConfigModule,
    forwardRef(() => MaritalStatusesModule),
    forwardRef(() => OcupationsModule),
    forwardRef(() => RolesModule),
    forwardRef(() => GendersModule),
    forwardRef(() => IdentificationsTypesModule),
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
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h',
          },
        };
      },
    }),
  ],
  exports: [UsersService, JwtStrategy, PassportModule, JwtModule],
})
export class UsersModule {}
