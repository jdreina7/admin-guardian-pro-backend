import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';
import { Ocupation } from './schemas/ocupation.schema';
import { customCapitalizeFirstLetter, customHandlerCatchException } from 'src/utils/utils';

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

      return { data };
    } catch (error) {
      return await customHandlerCatchException(error);
    }
  }

  // Get one ocupation
  async findOne(id: number) {
    return `This action returns a #${id} ocupation`;
  }

  update(id: number, updateOcupationDto: UpdateOcupationDto) {
    return `This action updates a #${id} ocupation`;
  }

  remove(id: number) {
    return `This action removes a #${id} ocupation`;
  }
}
