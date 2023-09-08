import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { RolesModule } from './modules/roles/roles.module';
import { CredentialsModule } from './modules/credentials/credentials.module';
 


@Module({
  imports: [
    ConfigModule.forRoot(),
    RolesModule, 
    MongooseModule.forRoot(process.env.MONGO_URI), 
    CredentialsModule],
})
export class AppModule {}
