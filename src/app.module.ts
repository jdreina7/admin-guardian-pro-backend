import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { RolesModule } from './modules/roles/roles.module';
 


@Module({
  imports: [
    ConfigModule.forRoot(),
    RolesModule, 
    MongooseModule.forRoot(process.env.MONGO_URI)],
})
export class AppModule {}
