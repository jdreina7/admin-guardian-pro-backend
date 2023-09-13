import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Documents } from './schemas/document.schema';
import { customHandlerCatchException, customValidateMongoId } from 'src/utils/utils';
import { ERR_MSG_INVALID_ID } from 'src/utils/contants';

@Injectable()
export class DocumentsService {
  constructor(@InjectModel(Documents.name) private readonly documentModel: Model<Documents>) {}

  //Create new document
  async create(createDocumentDto: CreateDocumentDto) {
    createDocumentDto.documentName = createDocumentDto.documentName.toLocaleLowerCase();

    try {
      const data = await this.documentModel.create(createDocumentDto);

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createDocumentDto);
    }
  }

  // Find all documents created
  findAll() {
    return `This action returns all documents`;
  }

  // Find a document by id
  async findOne(id: string) {
    await customValidateMongoId(id);

    const existDoc: Documents = await this.documentModel.findById(id);

    if (!existDoc) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_ID,
        invalidValue: `Document ID: ${id}`,
      });
    }
    return {
      success: true,
      data: existDoc,
    };
  }

  // Update a document by id
  update(id: string, updateDocumentDto: UpdateDocumentDto) {
    return `This action updates a #${id} document`;
  }

  // Delete a document
  remove(id: string) {
    return `This action removes a #${id} document`;
  }
}
