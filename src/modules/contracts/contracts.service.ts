import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contract } from './schemas/contract.schema';
import { Model } from 'mongoose';
import { ContractAppend } from '../contract-appends/schemas/contract-append.schema';
import { Contractor } from '../contractors/schemas/contractor.schema';
import { ContractorsService } from '../contractors/contractors.service';
import { ContractAppendsService } from '../contract-appends/contract-appends.service';
import { customHandlerCatchException, customValidateMongoId } from 'src/utils/utils';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_GENERAL, ERR_MSG_INVALID_ID } from 'src/utils/contants';

@Injectable()
export class ContractsService {
  constructor(
    @InjectModel(Contract.name) private readonly contractModel: Model<Contract>,
    @InjectModel(ContractAppend.name) private readonly contractAppendModel: Model<ContractAppend>,
    @InjectModel(Contractor.name) private readonly contractorModel: Model<Contractor>,
    @InjectModel(User.name) private readonly userModel: Model<User>,

    @Inject(ContractorsService) private readonly contractorService: ContractorsService,
    @Inject(ContractAppendsService) private readonly contractAppendsService: ContractAppendsService,
    @Inject(UsersService) private readonly userService: UsersService,
  ) {}

  // Create a Contract
  async create(createContractDto: CreateContractDto) {
    //Comprobaremos si existen los Id
    // ContractAppend Id
    createContractDto.contractAppendsId
      ? await this.contractAppendsService.findOne(createContractDto.contractAppendsId)
      : '';
    //Contract ID
    createContractDto.contractorId ? await this.contractorService.findOne(createContractDto.contractorId) : '';
    //User ID
    createContractDto.contractHolderuserId
      ? await this.userService.findOne(createContractDto.contractHolderuserId)
      : '';
    createContractDto.createdByUserId ? await this.userService.findOne(createContractDto.createdByUserId) : '';

    try {
      const contract = await this.contractModel.create(createContractDto);
      return {
        success: true,
        data: contract,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createContractDto);
    }
  }

  // Find all Contracts
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    try {
      const allContracts = await this.contractModel
        .find()
        .populate('contractorId', 'userId')
        .populate('contractHolderuserId', 'uid')
        .populate('createdByUserId', 'uid')
        .populate('contractAppendsId', 'title')
        .limit(limit)
        .skip(offset)
        .sort({ name: 1 })
        .select('-createdAt -updatedAt');
      return {
        success: true,
        data: allContracts,
      };
    } catch (error) {
      return await customHandlerCatchException(error);
    }
  }

  // Find a Contract by Id
  async findOne(id: string) {
    await customValidateMongoId(id);

    const contract: Contract = await this.contractModel
      .findById(id)
      .populate('contractorId', 'userId')
      .populate('contractHolderuserId', 'uid')
      .populate('createdByUserId', 'uid')
      .populate('contractAppendsId', 'title')
      .select('-createdAt -updatedAt');

    if (!contract) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: `Contract ID: ${id}`,
      });
    }

    return {
      success: true,
      data: contract,
    };
  }

  // Update a Contract by Id
  async update(id: string, updateContractDto: UpdateContractDto) {
    await this.findOne(id);

    updateContractDto.contractAppendsId
      ? await this.contractAppendsService.findOne(updateContractDto.contractAppendsId)
      : '';
    //Contract ID
    updateContractDto.contractorId ? await this.contractorService.findOne(updateContractDto.contractorId) : '';
    //User ID
    updateContractDto.contractHolderuserId
      ? await this.userService.findOne(updateContractDto.contractHolderuserId)
      : '';
    updateContractDto.createdByUserId ? await this.userService.findOne(updateContractDto.createdByUserId) : '';

    try {
      const contractToUpdate = await this.contractModel
        .findByIdAndUpdate(id, updateContractDto, { new: true })
        .populate('contractorId', 'userId')
        .populate('contractHolderuserId', 'uid')
        .populate('createdByUserId', 'uid')
        .populate('contractAppendsId', 'title')
        .select('-createdAt -updatedAt');

      return {
        success: true,
        data: contractToUpdate,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateContractDto);
    }
  }

  // Delete a Contract
  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.contractModel.findByIdAndDelete(id);

      return {
        success: true,
        data: { id },
      };
    } catch (error) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_GENERAL,
      });
    }
  }
}
