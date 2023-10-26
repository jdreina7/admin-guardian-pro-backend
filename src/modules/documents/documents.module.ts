import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentSchema, Documents } from './schemas/document.schema';
import { DocumentType, DocumentTypeSchema } from '../document-types/schemas/document-type.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { DocumentTypesModule } from '../document-types/document-types.module';
// import { LoginModule } from '../login/login.module';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [
    // forwardRef(() => LoginModule),
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
