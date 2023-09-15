import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentType } from './schemas/document-type.schema';
import { Model } from 'mongoose';
import { customCapitalizeFirstLetter, customHandlerCatchException, customValidateMongoId } from '../../utils/utils';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_INVALID_PAYLOAD } from 'src/utils/contants';

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
        invalidValue: `Document-Type ID: ${id}`,
      });
    }
    return {
      success: true,
      data: existDocType,
    };
  }

  //Update a type of doc by id
  async update(id: string, updateDocumentTypeDto: UpdateDocumentTypeDto) {
    await this.findOne(id);

    if (updateDocumentTypeDto?.type?.length <= 0) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_PAYLOAD,
        invalidValue: { ...updateDocumentTypeDto },
      });
    }

    if (updateDocumentTypeDto?.type) {
      updateDocumentTypeDto.type = await customCapitalizeFirstLetter(updateDocumentTypeDto?.type);
    }

    try {
      const dataToUpdate = await this.documetTypeModel
        .findByIdAndUpdate(id, updateDocumentTypeDto, { new: true })
        .select('-createdAt');

      return {
        success: true,
        data: dataToUpdate,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateDocumentTypeDto);
    }
  }

  //Remove a type of doc by id
  async remove(id: string) {
    const docTypeToDelete = await this.findOne(id);

    try {
      await this.documetTypeModel.findByIdAndDelete(id);

      return {
        success: true,
        data: docTypeToDelete,
      };
    } catch (error) {
      return await customHandlerCatchException(error);
    }
  }
}
