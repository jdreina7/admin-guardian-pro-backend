import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';
import { DocumentType, DocumentTypeSchema } from './schemas/document-type.schema';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
  imports: [
    forwardRef(() => UsersModule),
    MongooseModule.forFeature([
      {
        name: DocumentType.name,
        schema: DocumentTypeSchema,
      },
    ]),
  ],
  exports: [DocumentTypesService],
})
export class DocumentTypesModule {}
