import { Injectable } from '@nestjs/common';
import { CreateMaritalStatusDto } from './dto/create-marital-status.dto';
import { UpdateMaritalStatusDto } from './dto/update-marital-status.dto';
import { customCapitalizeFirstLetter, customHandlerCatchException } from 'src/utils/utils';
import { InjectModel } from '@nestjs/mongoose';
import { MaritalStatus } from './schemas/marital-status.schema';
import { Model } from 'mongoose';

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

  findOne(id: number) {
    return `This action returns a #${id} maritalStatus`;
  }

  update(id: number, updateMaritalStatusDto: UpdateMaritalStatusDto) {
    return `This action updates a #${id} maritalStatus`;
  }

  remove(id: number) {
    return `This action removes a #${id} maritalStatus`;
  }
}
