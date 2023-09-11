import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentType } from './schemas/document-type.schema';
import { Model } from 'mongoose';
import { customHandlerCatchException, customValidateMongoId } from '../../utils/utils';
import { ERR_MSG_DATA_NOT_FOUND } from 'src/utils/contants';

@Injectable()
export class DocumentTypesService {
  constructor(@InjectModel(DocumentType.name) private readonly documetTypeModel: Model<DocumentType>) {}

  //Create a type of doc
  async create(createDocumentTypeDto: CreateDocumentTypeDto) {
    createDocumentTypeDto.type = createDocumentTypeDto.type.toLocaleLowerCase();

    try {
      const createdDocType = await this.documetTypeModel.create(createDocumentTypeDto);

      return {
        success: true,
        data: createdDocType,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createDocumentTypeDto);
    }
  }

  //Get all types of doc
  async findAll() {
    try {
      const docTypes = await this.documetTypeModel.find().sort({ type: 1 }).select('-createdAt -updatedAt');

      return {
        success: true,
        data: docTypes,
      };
    } catch (error) {
      return await customHandlerCatchException(error);
    }
  }

  //Get a type of doc by id
  async findOne(id: string) {
    await customValidateMongoId(id);

    const existDocType = await this.documetTypeModel.findById(id);

    if (!existDocType) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: `Ocupation ID: ${id}`,
      });
    }
    return {
      success: true,
      data: existDocType,
    };
  }

  //Update a type of doc by id
  update(id: string, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    return `This action updates a #${id} documentType`;
  }

  remove(id: string) {
    return `This action removes a #${id} documentType`;
  }
}
