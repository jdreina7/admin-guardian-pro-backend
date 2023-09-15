import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractAppendDto } from './dto/create-contract-append.dto';
import { UpdateContractAppendDto } from './dto/update-contract-append.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ContractAppend } from './schemas/contract-append.schema';
import { Model, isValidObjectId } from 'mongoose';
import { UsersService } from '../users/users.service';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_GENERAL, ERR_MSG_INVALID_ID, ERR_MSG_INVALID_UID } from 'src/utils/contants';
import { customHandlerCatchException } from 'src/utils/utils';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ContractAppendsService {
  constructor(
    // Models
    @InjectModel(ContractAppend.name) private readonly contractAppendModel: Model<ContractAppend>,
    // Services
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  // Create contract append
  async create(createContractAppendDto: CreateContractAppendDto) {
    // UID validations
    if (!createContractAppendDto.createdByUserId) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_UID,
        invalidValue: `ID: ${createContractAppendDto.createdByUserId}`,
      });
    }

    if (!isValidObjectId(createContractAppendDto.createdByUserId)) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_ID,
        invalidValue: `User ID: ${createContractAppendDto.createdByUserId}`,
      });
    }

    await this.userService.findOne(createContractAppendDto.createdByUserId);

    try {
      const userCreated = await this.contractAppendModel.create(createContractAppendDto);

      return {
        success: true,
        data: userCreated,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createContractAppendDto);
    }
  }

  // Get all contracts appends
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const data = await this.contractAppendModel
      .find()
      .populate('createdByUserId')
      .limit(limit)
      .skip(offset)
      .sort({ title: 1 });

    return {
      success: true,
      data,
    };
  }

  // Get one contract append
  async findOne(id: string) {
    // UID validations
    if (!id) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_UID,
        invalidValue: `ID: ${id}`,
      });
    }

    if (!isValidObjectId(id)) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_ID,
        invalidValue: `Contract Append ID: ${id}`,
      });
    }

    const existContractAppend: ContractAppend = await this.contractAppendModel.findById(id).populate('createdByUserId');

    if (!existContractAppend) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: `Contract Append ID: ${id}`,
      });
    }

    return {
      success: true,
      data: existContractAppend,
    };
  }

  // Patch one contract append
  async update(id: string, updateContractAppendDto: UpdateContractAppendDto) {
    if (updateContractAppendDto.createdByUserId) {
      await this.findOne(id);
      await this.userService.findOne(updateContractAppendDto.createdByUserId);
    }

    try {
      const data = await this.contractAppendModel
        .findByIdAndUpdate(id, updateContractAppendDto, { new: true })
        .select('-updatedAt -createdAt');

      return {
        success: true,
        data,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateContractAppendDto);
    }
  }

  // Delete one contract append
  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.contractAppendModel.findByIdAndDelete(id);

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
