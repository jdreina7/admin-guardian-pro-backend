import { Module } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Credential, CredentialSchema } from './schemas/credential.schema';

@Module({
  controllers: [CredentialsController],
  providers: [CredentialsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Credential.name,
        schema: CredentialSchema,
      },
    ]),
  ],
})
export class CredentialsModule {}
