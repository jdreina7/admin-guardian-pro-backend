import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { Gender } from './schemas/gender.schema';
import { customCapitalizeFirstLetter, customHandlerCatchException } from 'src/utils/utils';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_INVALID_ID, ERR_MSG_INVALID_PAYLOAD } from 'src/utils/contants';

@Injectable()
export class GendersService {
  constructor(@InjectModel(Gender.name) private readonly genderModel: Model<Gender>) {}

  // Create gender
  async create(createGenderDto: CreateGenderDto) {
    createGenderDto.name = await customCapitalizeFirstLetter(createGenderDto.name);

    try {
      const genderCreated = await this.genderModel.create(createGenderDto);

      return {
        success: true,
        data: genderCreated,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createGenderDto);
    }
  }

  // Get all Genders
  async findAll() {
    try {
      const data = await this.genderModel.find().sort({ name: 1 });

      return {
        success: true,
        data,
      };
    } catch (error) {
      return await customHandlerCatchException(error);
    }
  }

  // Get one gender
  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_ID,
        invalidValue: id,
      });
    }

    const existGender: Gender = await this.genderModel.findById(id);

    if (!existGender) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: id,
      });
    }

    return {
      success: true,
      data: existGender,
    };
  }

  // Patch gender
  async update(id: string, updateGenderDto: UpdateGenderDto) {
    await this.findOne(id);

    if (updateGenderDto?.name?.length <= 0) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_PAYLOAD,
        invalidValue: { ...updateGenderDto },
      });
    }

    if (updateGenderDto?.name) {
      updateGenderDto.name = await customCapitalizeFirstLetter(updateGenderDto?.name);
    }

    try {
      const data = await this.genderModel
        .findByIdAndUpdate(id, updateGenderDto, { new: true })
        .select('-updatedAt -createdAt');

      return {
        success: true,
        data,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateGenderDto);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} gender`;
  }
}
