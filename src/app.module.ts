import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { RolesModule } from './modules/roles/roles.module';
import { OcupationsModule } from './modules/ocupations/ocupations.module';
import { MaritalStatusesModule } from './modules/marital-statuses/marital-statuses.module';
import { UsersModule } from './modules/users/users.module';
import { GendersModule } from './modules/genders/genders.module';
import { DocumentTypesModule } from './modules/document-types/document-types.module';
import { IdentificationsTypesModule } from './modules/identifications-types/identification-types.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { ContractorsModule } from './modules/contractors/contractors.module';
import { ContractAppendsModule } from './modules/contract-appends/contract-appends.module';
import { ContractsModule } from './modules/contracts/contracts.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    RolesModule,
    OcupationsModule,
    MaritalStatusesModule,
    UsersModule,
    GendersModule,
    DocumentTypesModule,
    IdentificationsTypesModule,
    DocumentsModule,
    ContractorsModule,
    ContractAppendsModule,
    ContractsModule,
  ],
})
export class AppModule {}
