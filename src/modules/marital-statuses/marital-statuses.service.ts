import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateMaritalStatusDto } from './dto/create-marital-status.dto';
import { UpdateMaritalStatusDto } from './dto/update-marital-status.dto';
import { MaritalStatus } from './schemas/marital-status.schema';
import { customCapitalizeFirstLetter, customHandlerCatchException } from './../../utils/utils';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_ID,
  ERR_MSG_INVALID_PAYLOAD,
} from './../../utils/contants';

@Injectable()
export class MaritalStatusesService {
  constructor(@InjectModel(MaritalStatus.name) private readonly MaritalStatusModel: Model<MaritalStatus>) {}

  // Create Marital Status
  async create(createMaritalStatusDto: CreateMaritalStatusDto) {
    createMaritalStatusDto.name = await customCapitalizeFirstLetter(createMaritalStatusDto.name);

    try {
      const MaritalStatusCreated = await this.MaritalStatusModel.create(createMaritalStatusDto);

      return {
        success: true,
        data: MaritalStatusCreated,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createMaritalStatusDto);
    }
  }

  // Get all Marital Statuses
  async findAll() {
    try {
      const data = await this.MaritalStatusModel.find().sort({ name: 1 });

      return {
        success: true,
        data,
      };
    } catch (error) {
      return await customHandlerCatchException(error);
    }
  }

  // Get one Marital status
  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_ID,
        invalidValue: `MaritalStatus ID: ${id}`,
      });
    }

    const existMaritalStatus: MaritalStatus = await this.MaritalStatusModel.findById(id);

    if (!existMaritalStatus) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: `MaritalStatus ID: ${id}`,
      });
    }

    return {
      success: true,
      data: existMaritalStatus,
    };
  }

  // Patch one Marital Status
  async update(id: string, updateMaritalStatusDto: UpdateMaritalStatusDto) {
    await this.findOne(id);

    if (updateMaritalStatusDto?.name?.length <= 0) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_PAYLOAD,
        invalidValue: { ...updateMaritalStatusDto },
      });
    }

    if (updateMaritalStatusDto?.name) {
      updateMaritalStatusDto.name = await customCapitalizeFirstLetter(updateMaritalStatusDto?.name);
    }

    try {
      const data = await this.MaritalStatusModel.findByIdAndUpdate(id, updateMaritalStatusDto, { new: true }).select(
        '-updatedAt -createdAt',
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateMaritalStatusDto);
    }
  }

  // Delete one Marital Status
  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.MaritalStatusModel.findByIdAndDelete(id);

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
