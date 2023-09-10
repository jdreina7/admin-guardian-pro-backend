import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateIdentificationTypesDto } from './dto/create-identificationTypes.dto';
import { UpdateIdentificationTypesDto } from './dto/update-identificationTypes.dto';
import { customHandlerCatchException, customValidateMongoId } from 'src/utils/utils';
import { IdentificationTypes } from './schemas/identificationTypes.schema';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_GENERAL, ERR_MSG_INVALID_PAYLOAD } from 'src/utils/contants';

@Injectable()
export class IdentificationsTypesService {
  constructor(
    @InjectModel(IdentificationTypes.name) private readonly IdentificationTypesModel: Model<IdentificationTypes>,
  ) {}

  // Create a Identification
  async create(createIdentificationTypesDto: CreateIdentificationTypesDto) {
    createIdentificationTypesDto.type = createIdentificationTypesDto.type.toLowerCase();

    try {
      const createdCred = await this.IdentificationTypesModel.create(createIdentificationTypesDto);

      return {
        succes: true,
        data: createdCred,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createIdentificationTypesDto);
    }
  }

  // Get all existing Identifications
  async findAll() {
    try {
      const data = await this.IdentificationTypesModel.find().sort({ type: 1 });

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Find a Identification by ID
  async findOne(id: string) {
    await customValidateMongoId(id);

    const existCred: IdentificationTypes = await this.IdentificationTypesModel.findById(id);

    if (!existCred) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: id,
      });
    }

    return {
      success: true,
      data: existCred,
    };
  }

  // find and update a Identification by ID
  async update(id: string, updateIdentificationTypesDto: UpdateIdentificationTypesDto) {
    await this.findOne(id);

    if (updateIdentificationTypesDto?.type?.length <= 0) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_PAYLOAD,
        invalidValue: { ...updateIdentificationTypesDto },
      });
    }

    try {
      const fullData = await this.IdentificationTypesModel.findByIdAndUpdate(id, updateIdentificationTypesDto, {
        new: true,
      }).select('-updatedAt -createdAt');
      return {
        success: true,
        data: fullData,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateIdentificationTypesDto);
    }
  }

  // Delete Identification
  async remove(id: string) {
    const existIdent = await this.findOne(id);

    try {
      await this.IdentificationTypesModel.findByIdAndDelete(id);

      return {
        success: true,
        data: existIdent,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_GENERAL,
      });
    }
  }
}
