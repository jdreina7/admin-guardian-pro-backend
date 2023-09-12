import { Module } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { DocumentTypesController } from './document-types.controller';
import { MongooseModule, Schema } from '@nestjs/mongoose';
import { DocumentType, DocumentTypeSchema } from './schemas/document-type.schema';

@Module({
  controllers: [DocumentTypesController],
  providers: [DocumentTypesService],
  imports: [
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
