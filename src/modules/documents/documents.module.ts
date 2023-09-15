import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema, Documents } from './schemas/document.schema';
import { DocumentType, DocumentTypeSchema } from '../document-types/schemas/document-type.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { DocumentTypesModule } from '../document-types/document-types.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [
    UsersModule,
    DocumentTypesModule,
    MongooseModule.forFeature([
      {
        name: Documents.name,
        schema: DocumentSchema,
      },
      {
        name: DocumentType.name,
        schema: DocumentTypeSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
