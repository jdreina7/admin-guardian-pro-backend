import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesModule } from './modules/roles/roles.module';
import { MONGP_URI } from './utils/contants';


@Module({
  imports: [RolesModule, MongooseModule.forRoot(MONGP_URI)],
})
export class AppModule {}
