import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Documents } from './schemas/document.schema';
import { customCapitalizeFirstLetter, customHandlerCatchException, customValidateMongoId } from 'src/utils/utils';
import { ERR_MSG_GENERAL, ERR_MSG_INVALID_ID, ERR_MSG_INVALID_PAYLOAD } from 'src/utils/contants';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Documents.name)
    private readonly documentModel: Model<Documents>,
  ) {}

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
  async findAll() {
    try {
      const allDocs = await this.documentModel.find().sort({ name: 1 }).select('-createdAt -updatedAt');
      return {
        success: true,
        data: allDocs,
      };
    } catch (error) {
      return await customHandlerCatchException(error);
    }
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
  async update(id: string, updateDocumentDto: UpdateDocumentDto) {
    await this.findOne(id);

    if (updateDocumentDto?.documentName?.length <= 0) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_PAYLOAD,
        invalidValue: { ...updateDocumentDto },
      });
    }

    if (updateDocumentDto?.documentName) {
      updateDocumentDto.documentName = await customCapitalizeFirstLetter(updateDocumentDto?.documentName);
    }

    try {
      const data = await this.documentModel
        .findByIdAndUpdate(id, updateDocumentDto, { new: true })
        .select('-updatedAt -createdAt');

      return {
        success: true,
        data,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateDocumentDto);
    }
  }

  // Delete a document
  async remove(id: string) {
    const docToDelete = await this.findOne(id);

    try {
      await this.documentModel.findByIdAndDelete(id);

      return {
        success: true,
        data: docToDelete,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_GENERAL,
      });
    }
  }
}
