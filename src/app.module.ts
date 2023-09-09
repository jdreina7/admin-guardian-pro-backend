import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { RolesModule } from './modules/roles/roles.module';
import { OcupationsModule } from './modules/ocupations/ocupations.module';
import { MaritalStatusesModule } from './modules/marital-statuses/marital-statuses.module';
import { UsersModule } from './modules/users/users.module';
import { GendersModule } from './modules/genders/genders.module';
import { IdentificationsTypesModule } from './modules/identificationsTypes/identificationTypes.module';

@Module({
  // eslint-disable-next-line prettier/prettier
  imports: [
    ConfigModule.forRoot(),
    RolesModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    OcupationsModule,
    MaritalStatusesModule,
    UsersModule,
    GendersModule,
    IdentificationsTypesModule,
  ],
})
export class AppModule {}
