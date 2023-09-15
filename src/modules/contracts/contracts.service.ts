import { Inject, Injectable } from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contract } from './schemas/contract.schema';
import { Model } from 'mongoose';
import { ContractAppend } from '../contract-appends/schemas/contract-append.schema';
import { Contractor } from '../contractors/schemas/contractor.schema';
import { ContractorsService } from '../contractors/contractors.service';
import { ContractAppendsService } from '../contract-appends/contract-appends.service';
import { customHandlerCatchException } from 'src/utils/utils';
import { User } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
    return `This action return a #${id} contract`;
  }

  // Update a Contract by Id
  update(id: string, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  // Delete a Contract
  remove(id: string) {
    return `This action removes a #${id} contract`;
  }
}
