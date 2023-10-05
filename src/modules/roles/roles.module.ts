import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Rol, RolSchema } from './schemas/role.schema';
import { LoginModule } from '../login/login.module';

@Module({
  controllers: [RolesController],
  providers: [RolesService],
  imports: [
    LoginModule,
    MongooseModule.forFeature([
      {
        name: Rol.name,
        schema: RolSchema,
      },
    ]),
  ],
  exports: [RolesService],
})
export class RolesModule {}
