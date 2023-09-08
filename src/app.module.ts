import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { RolesModule } from './modules/roles/roles.module';
import { OcupationsModule } from './modules/ocupations/ocupations.module';

@Module({
  // eslint-disable-next-line prettier/prettier
  imports: [
    ConfigModule.forRoot(),
    RolesModule,
    MongooseModule.forRoot(process.env.MONGO_URI),
    OcupationsModule,
  ],
})
export class AppModule {}
