import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contractor } from './schemas/contractor.schema';
import { Model, isValidObjectId } from 'mongoose';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_INVALID_ID, ERR_MSG_INVALID_UID } from 'src/utils/contants';
import { User } from '../users/schemas/user.schema';
import { customHandlerCatchException } from 'src/utils/utils';
import { UsersService } from '../users/users.service';

@Injectable()
export class ContractorsService {
  constructor(
    // Models
    @InjectModel(Contractor.name) private readonly contractorModel: Model<Contractor>,
    // Services
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  // Create contractor
  async create(createContractorDto: CreateContractorDto) {
    // UID validations
    if (!createContractorDto.userId) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_UID,
        invalidValue: `ID: ${createContractorDto.userId}`,
      });
    }

    if (!isValidObjectId(createContractorDto.userId)) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_ID,
        invalidValue: `User ID: ${createContractorDto.userId}`,
      });
    }

    await this.userService.findOne(createContractorDto.userId);

    try {
      const userCreated = await this.contractorModel.create(createContractorDto);

      return {
        success: true,
        data: userCreated,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createContractorDto);
    }
  }

  // Get all contractor
  async findAll() {
    const data = await this.contractorModel.find().populate('userId').sort({ firstName: 1 });

    return {
      success: true,
      data,
    };
  }

  // Find one contractor
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
        invalidValue: `User ID: ${id}`,
      });
    }

    const existContractor: User = await this.contractorModel.findById(id).populate('userId');

    if (!existContractor) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: `User ID: ${id}`,
      });
    }

    return {
      success: true,
      data: existContractor,
    };
  }

  update(id: number, updateContractorDto: UpdateContractorDto) {
    return `This action updates a #${id} contractor`;
  }

  remove(id: number) {
    return `This action removes a #${id} contractor`;
  }
}
