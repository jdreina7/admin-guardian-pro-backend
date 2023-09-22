import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './schemas/role.schema';
import { customHandlerCatchException } from '../../utils/utils';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_PAYLOAD,
  ERR_MSG_INVALID_VALUE,
} from '../..//utils/contants';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Rol.name) private readonly rolModel: Model<Rol>) {}

  // Create a rol
  async create(createRoleDto: CreateRoleDto) {
    createRoleDto.name = createRoleDto.name.toLowerCase();

    try {
      const rolCreated = await this.rolModel.create(createRoleDto);

      return {
        success: true,
        data: rolCreated,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createRoleDto);
    }
  }

  // Get all roles
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const data = await this.rolModel.find().limit(limit).skip(offset).sort({ name: 1 });

      return {
        success: true,
        data,
      };

      return {
        success: true,
        data,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  // Search Rol by Id
  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_VALUE,
        invalidValue: `Role ID: ${id}`,
      });
    }

    const existRol: Rol = await this.rolModel.findById(id);

    if (!existRol) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: `Role ID: ${id}`,
      });
    }

    return {
      success: true,
      data: existRol,
    };
  }

  // Update Rol
  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const existingId = await this.findOne(id);

    if (updateRoleDto?.name?.length <= 0) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_PAYLOAD,
        invalidValue: { ...updateRoleDto },
      });
    }

    if (!existingId) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: id,
      });
    }

    try {
      const fullData = await this.rolModel
        .findByIdAndUpdate(id, updateRoleDto, { new: true })
        .select('-updatedAt -createdAt');
      return {
        success: true,
        data: fullData,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateRoleDto);
    }
  }

  //Delete Rol
  async remove(id: string) {
    const existId = await this.findOne(id);

    if (!existId) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: id,
      });
    }

    try {
      await this.rolModel.findByIdAndDelete(id);
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
