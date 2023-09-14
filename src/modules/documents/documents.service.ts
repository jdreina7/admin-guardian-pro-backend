import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { Documents } from './schemas/document.schema';
import { customCapitalizeFirstLetter, customHandlerCatchException, customValidateMongoId } from 'src/utils/utils';
import { ERR_MSG_GENERAL, ERR_MSG_INVALID_ID, ERR_MSG_INVALID_PAYLOAD } from 'src/utils/contants';
import { User } from '../users/schemas/user.schema';
import { DocumentType } from '../document-types/schemas/document-type.schema';
import { UsersService } from '../users/users.service';
import { DocumentTypesService } from '../document-types/document-types.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(Documents.name)
    private readonly documentModel: Model<Documents>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(DocumentType.name)
    private readonly documentTypeModel: Model<DocumentType>,

    @Inject(UsersService) private readonly userService: UsersService,
    @Inject(DocumentTypesService)
    private readonly documentTypeService: DocumentTypesService,
  ) {}

  //Create new document
  async create(createDocumentDto: CreateDocumentDto) {
    createDocumentDto.documentName = createDocumentDto.documentName.toLocaleLowerCase();

    // UderId validation
    createDocumentDto.userOwnerId ? await this.userService.findOne(createDocumentDto.userOwnerId) : '';

    // DocumentTypeId validation
    createDocumentDto.documentTypeId ? await this.documentTypeService.findOne(createDocumentDto.documentTypeId) : '';
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
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    try {
      const allDocs = await this.documentModel
        .find()
        .populate('documentTypeId', 'type')
        .populate('userOwnerId', 'uid')
        .limit(limit)
        .skip(offset)
        .sort({ name: 1 })
        .select('-createdAt -updatedAt');
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

    const existDoc: Documents = await this.documentModel
      .findById(id)
      .populate('documentTypeId', 'type')
      .populate('userOwnerId', 'uid');

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

    // UderId validation
    updateDocumentDto.userOwnerId ? await this.userService.findOne(updateDocumentDto.userOwnerId) : '';

    // DocumentTypeId validation
    updateDocumentDto.documentTypeId ? await this.documentTypeService.findOne(updateDocumentDto.documentTypeId) : '';

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
