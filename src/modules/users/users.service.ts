import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { isValidObjectId } from 'mongoose';

import { customCapitalizeFirstLetter, customHandlerCatchException, validateUID } from 'src/utils/utils';
import { Rol } from '../roles/schemas/role.schema';
import { MaritalStatus } from '../marital-statuses/schemas/marital-status.schema';
import { Ocupation } from '../ocupations/schemas/ocupation.schema';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import {
  ERR_MSG_DATA_NOT_FOUND,
  ERR_MSG_GENERAL,
  ERR_MSG_INVALID_ID,
  ERR_MSG_INVALID_OCUPATION_ID,
  ERR_MSG_INVALID_PAYLOAD,
  ERR_MSG_INVALID_ROLE_ID,
  ERR_MSG_INVALID_UID,
} from 'src/utils/contants';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Rol.name) private readonly rolModel: Model<Rol>,
    @InjectModel(MaritalStatus.name) private readonly MaritalStatusModel: Model<MaritalStatus>,
    @InjectModel(Ocupation.name) private readonly ocupationModel: Model<Ocupation>,
  ) {}

  // Create user
  async create(createUserDto: CreateUserDto) {
    // UID validations
    if (!createUserDto.uid) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_UID,
        invalidValue: `ID: ${createUserDto.uid}`,
      });
    }

    const validUserID = await validateUID(createUserDto.uid);

    if (!validUserID) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_UID,
        invalidValue: `ID: ${createUserDto.uid}`,
      });
    }

    // IdentificationTypeId validation
    // const idTypeExist: Partial<IdentificationType> = (await this.rolModel.findById(createUserDto.roleId)) as any;

    // if (!rolExist) {
    //   throw new NotFoundException({
    //     succes: false,
    //     message: ERR_MSG_INVALID_ROLE_ID,
    //     invalidValue: createUserDto.roleId,
    //   });
    // }

    // RoleId validation
    const maritalStatusExist: Partial<MaritalStatus> = (await this.MaritalStatusModel.findById(
      createUserDto.maritalStatusId,
    )) as any;

    if (!maritalStatusExist) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_INVALID_ROLE_ID,
        invalidValue: createUserDto.roleId,
      });
    }

    // OcupationId validation
    const ocupationExist: Partial<Ocupation> = (await this.ocupationModel.findById(createUserDto.ocupationId)) as any;

    if (!ocupationExist) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_INVALID_OCUPATION_ID,
        invalidValue: createUserDto.roleId,
      });
    }

    // RoleId validation
    const roleExist: Partial<Rol> = (await this.rolModel.findById(createUserDto.roleId)) as any;

    if (!roleExist) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_INVALID_ROLE_ID,
        invalidValue: createUserDto.roleId,
      });
    }

    // capitalize the user names
    createUserDto.firstName
      ? (createUserDto.firstName = await customCapitalizeFirstLetter(createUserDto.firstName))
      : '';
    createUserDto.middleName
      ? (createUserDto.middleName = await customCapitalizeFirstLetter(createUserDto.middleName))
      : '';
    createUserDto.lastName ? (createUserDto.lastName = await customCapitalizeFirstLetter(createUserDto.lastName)) : '';

    try {
      const userCreated = await this.userModel.create(createUserDto);

      return {
        success: true,
        data: userCreated,
      };
    } catch (error) {
      return await customHandlerCatchException(error, createUserDto);
    }
  }

  // Get all users
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    // eslint-disable-next-line prettier/prettier
    const data = await this.userModel.find()
      // .populate('identificationTypeId', 'name')
      .populate('maritalStatusId', 'name')
      .populate('ocupationId', 'name')
      .populate('roleId', 'name')
      .limit(limit)
      .skip(offset)
      .sort({ firstName: 1 });

    return {
      success: true,
      data,
    };
  }

  // Get one User
  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_ID,
        invalidValue: id,
      });
    }

    const existUser: User = await this.userModel.findById(id);

    if (!existUser) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: id,
      });
    }

    return {
      success: true,
      data: existUser,
    };
  }

  // Patch user
  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findOne(id);

    // capitalize the user names
    updateUserDto.firstName
      ? (updateUserDto.firstName = await customCapitalizeFirstLetter(updateUserDto.firstName))
      : '';
    updateUserDto.middleName
      ? (updateUserDto.middleName = await customCapitalizeFirstLetter(updateUserDto.middleName))
      : '';
    updateUserDto.lastName ? (updateUserDto.lastName = await customCapitalizeFirstLetter(updateUserDto.lastName)) : '';

    try {
      const data = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .select('-updatedAt -createdAt');

      return {
        success: true,
        data,
      };
    } catch (error) {
      return await customHandlerCatchException(error, updateUserDto);
    }
  }

  // Delete user
  async remove(id: string) {
    await this.findOne(id);

    try {
      await this.userModel.findByIdAndDelete(id);

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
