import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateIdentificationDto } from './dto/create-identification.dto';
import { UpdateIdentificationDto } from './dto/update-identification.dto';
import { customHandlerCatchException, customValidateMongoId } from 'src/utils/utils';
import { Identification } from './schemas/identification.schema';
import { ERR_MSG_DATA_NOT_FOUND } from 'src/utils/contants';

@Injectable()
export class IdentificationsService {
  constructor(@InjectModel(Identification.name) private readonly IdentificationModel: Model<Identification>) {}

  // Create a Credential
  async create(createIdentificationlDto: CreateIdentificationDto) {
    createIdentificationlDto.type = createIdentificationlDto.type.toLowerCase();

    try {
      const createdCred = await this.IdentificationModel.create(createIdentificationlDto);

      return {
        succes: true,
        createdCred,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createIdentificationlDto);
    }
  }

  // Get all existing credentials
  async findAll() {
    try {
      const data = await this.IdentificationModel.find().sort({ type: 1 });

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Find a credential by ID
  async findOne(id: string) {
    await customValidateMongoId(id);

    const existCred = await this.IdentificationModel.findById(id);

    if (!existCred) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: id,
      });
    }

    return {
      success: true,
      existCred,
    };
  }

  // find and update a credential by ID
  update(id: string, updateIdentificationDto: UpdateIdentificationDto) {
    return `This action updates a #${id} credential`;
  }

  // Delete credential
  remove(id: string) {
    return `This action removes a #${id} credential`;
  }
}
