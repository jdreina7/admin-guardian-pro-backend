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

  findAll() {
    return `This action returns all contracts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contract`;
  }

  update(id: number, updateContractDto: UpdateContractDto) {
    return `This action updates a #${id} contract`;
  }

  remove(id: number) {
    return `This action removes a #${id} contract`;
  }
}
