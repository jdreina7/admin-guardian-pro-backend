import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema, Documents } from './schemas/document.schema';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Documents.name,
        schema: DocumentSchema,
      },
    ]),
  ],
  exports: [DocumentsService],
})
export class DocumentsModule {}
