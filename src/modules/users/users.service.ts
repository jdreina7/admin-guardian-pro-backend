import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
import { IdentificationTypes } from '../identificationsTypes/schemas/identificationTypes.schema';
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
import { MaritalStatusesService } from '../marital-statuses/marital-statuses.service';
import { GendersService } from '../genders/genders.service';
import { OcupationsService } from '../ocupations/ocupations.service';
import { RolesService } from '../roles/roles.service';
import { IdentificationsTypesService } from '../identificationsTypes/identificationTypes.service';

@Injectable()
export class UsersService {
  constructor(
    // Models injection
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Rol.name) private readonly rolModel: Model<Rol>,
    @InjectModel(MaritalStatus.name) private readonly MaritalStatusModel: Model<MaritalStatus>,
    @InjectModel(Ocupation.name) private readonly ocupationModel: Model<Ocupation>,
    @InjectModel(IdentificationTypes.name) private readonly IdentificationTypes: Model<IdentificationTypes>,
    // Services injection
    @Inject(GendersService) private readonly genderService: GendersService,
    @Inject(MaritalStatusesService) private readonly maritalService: MaritalStatusesService,
    @Inject(OcupationsService) private readonly ocupationervice: OcupationsService,
    @Inject(RolesService) private readonly rolesService: RolesService,
    @Inject(IdentificationsTypesService) private readonly identificationsTypesService: IdentificationsTypesService,
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

    // genderId validation
    createUserDto.genderId ? await this.genderService.findOne(createUserDto.genderId) : '';

    // maritalStatusId validation
    createUserDto.maritalStatusId ? await this.maritalService.findOne(createUserDto.maritalStatusId) : '';

    // ocupationId validation
    createUserDto.ocupationId ? await this.ocupationervice.findOne(createUserDto.ocupationId) : '';

    // roleId validation
    createUserDto.roleId ? await this.rolesService.findOne(createUserDto.roleId) : '';

    // idetificationTypeId validation
    createUserDto.identificationTypeId
      ? await this.identificationsTypesService.findOne(createUserDto.identificationTypeId)
      : '';

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

    const data = await this.userModel
      .find()
      .populate('genderId', 'name')
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
        invalidValue: `User ID: ${id}`,
      });
    }

    const existUser: User = await this.userModel
      .findById(id)
      .populate('identificationTypeId', 'type')
      .populate('genderId', 'name')
      .populate('maritalStatusId', 'name')
      .populate('ocupationId', 'name')
      .populate('roleId', 'name');

    if (!existUser) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: `User ID: ${id}`,
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

    // genderId validation
    updateUserDto.genderId ? await this.genderService.findOne(updateUserDto.genderId) : '';

    // maritalStatusId validation
    updateUserDto.maritalStatusId ? await this.maritalService.findOne(updateUserDto.maritalStatusId) : '';

    // ocupationId validation
    updateUserDto.ocupationId ? await this.ocupationervice.findOne(updateUserDto.ocupationId) : '';

    // roleId validation
    updateUserDto.roleId ? await this.rolesService.findOne(updateUserDto.roleId) : '';

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
