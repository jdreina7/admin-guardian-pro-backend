import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { Gender } from './schemas/gender.schema';
import { customCapitalizeFirstLetter, customHandlerCatchException } from 'src/utils/utils';

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

  findAll() {
    return `This action returns all genders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} gender`;
  }

  update(id: number, updateGenderDto: UpdateGenderDto) {
    return `This action updates a #${id} gender`;
  }

  remove(id: number) {
    return `This action removes a #${id} gender`;
  }
}
