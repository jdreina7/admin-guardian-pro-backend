import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contractor } from './schemas/contractor.schema';
import { Model, isValidObjectId } from 'mongoose';
import { ERR_MSG_INVALID_ID, ERR_MSG_INVALID_UID } from 'src/utils/contants';
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

  findAll() {
    return `This action returns all contractors`;
  }

  // Find one contractor
  async findOne(id: number) {
    // if (!isValidObjectId(id)) {
    //   throw new BadRequestException({
    //     success: false,
    //     message: ERR_MSG_INVALID_ID,
    //     invalidValue: `User ID: ${id}`,
    //   });
    // }
    // const existUser: User = await this.userModel
    //   .findById(id)
    //   .populate('identificationTypeId', 'type')
    //   .populate('genderId', 'name')
    //   .populate('maritalStatusId', 'name')
    //   .populate('ocupationId', 'name')
    //   .populate('roleId', 'name');
    // if (!existUser) {
    //   throw new NotFoundException({
    //     succes: false,
    //     message: ERR_MSG_DATA_NOT_FOUND,
    //     invalidValue: `User ID: ${id}`,
    //   });
    // }
    // return {
    //   success: true,
    //   data: existUser,
    // };
  }

  update(id: number, updateContractorDto: UpdateContractorDto) {
    return `This action updates a #${id} contractor`;
  }

  remove(id: number) {
    return `This action removes a #${id} contractor`;
  }
}
