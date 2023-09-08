import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';
import { Ocupation } from './schemas/ocupation.schema';
import { customCapitalizeFirstLetter, customHandlerCatchException } from 'src/utils/utils';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_ID,
  ERR_MSG_INVALID_PAYLOAD,
} from 'src/utils/contants';

@Injectable()
export class OcupationsService {
  constructor(@InjectModel(Ocupation.name) private readonly ocupationModel: Model<Ocupation>) {}

  // Create a Ocupation
  async create(createOcupationDto: CreateOcupationDto) {
    createOcupationDto.name = await customCapitalizeFirstLetter(createOcupationDto.name);

    try {
      const ocupationCreated = await this.ocupationModel.create(createOcupationDto);

      return {
        success: true,
        data: ocupationCreated,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createOcupationDto);
    }
  }

  // Get all ocupations
  async findAll() {
    try {
      const data = await this.ocupationModel.find().sort({ name: 1 });

      return {
        success: true,
        data,
      };
    } catch (error) {
      return await customHandlerCatchException(error);
    }
  }

  // Get one ocupation
  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_ID,
        invalidValue: id,
      });
    }

    const existOcupation: Ocupation = await this.ocupationModel.findById(id);

    if (!existOcupation) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: id,
      });
    }

    return {
      success: true,
      data: existOcupation,
    };
  }

  // Patch one ocupation
  async update(id: string, updateOcupationDto: UpdateOcupationDto) {
    await this.findOne(id);

    if (updateOcupationDto?.name?.length <= 0) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_PAYLOAD,
        invalidValue: { ...updateOcupationDto },
      });
    }

    if (updateOcupationDto?.name) {
      updateOcupationDto.name = await customCapitalizeFirstLetter(updateOcupationDto?.name);
    }

    try {
      const data = await this.ocupationModel
        .findByIdAndUpdate(id, updateOcupationDto, { new: true })
        .select('-updatedAt -createdAt');

      return {
        success: true,
        data,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateOcupationDto);
    }
  }

  // Delete one ocupation
  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.ocupationModel.findByIdAndDelete(id);

      return {
        success: true,
        data: id,
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_GENERAL,
      });
    }
  }
}
