import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateContractAppendDto } from './dto/create-contract-append.dto';
import { UpdateContractAppendDto } from './dto/update-contract-append.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ContractAppend } from './schemas/contract-append.schema';
import { Model, isValidObjectId } from 'mongoose';
import { UsersService } from '../users/users.service';
import { ERR_MSG_INVALID_ID, ERR_MSG_INVALID_UID } from 'src/utils/contants';
import { customHandlerCatchException } from 'src/utils/utils';

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

  findAll() {
    return `This action returns all contractAppends`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contractAppend`;
  }

  update(id: number, updateContractAppendDto: UpdateContractAppendDto) {
    return `This action updates a #${id} contractAppend`;
  }

  remove(id: number) {
    return `This action removes a #${id} contractAppend`;
  }
}
