import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';


import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './schemas/role.schema';
import { customHandlerCatchException } from 'src/utils/utils';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_GENERAL, ERR_MSG_INVALID_ID, ERR_MSG_INVALID_PAYLOAD, ERR_MSG_INVALID_ROLE_ID, ERR_MSG_INVALID_VALUE, SUCC_MSG_GENERAL } from 'src/utils/contants';

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
        data: rolCreated
      }

    } catch (error) {
      return await customHandlerCatchException(error, createRoleDto);
    }
    
  }

// Get all roles
  async findAll() {
    try {
      const data = await this.rolModel.find()
      .sort({ name: 1 });
      
      return{
        data
      }

    } catch (error) {
      throw new BadRequestException(error);
    }
  }

// Search Rol by Id
  async findOne(id: string) {
    
    if ( !isValidObjectId( id ) ) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_ID,
        invalidValue: id,
      });
    }

    const existRol: Rol = await this.rolModel.findById( id ) ;

    if (!existRol) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_DATA_NOT_FOUND,
        invalidValue: id,
      });
    }

    return {
      success: true,
      data: existRol,
    }
  }

// Update Rol
  async update(id: string, updateRoleDto: UpdateRoleDto) {

    await this.findOne(id);

    if (updateRoleDto?.name?.length <= 0) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_PAYLOAD,
        invalidValue: { ...updateRoleDto },
      });
    }

    try {
      const fullData = await this.rolModel.findByIdAndUpdate(id, updateRoleDto,{new: true})
      .select('-updatedAt -createdAt')
      return  {
        success: true,
        data:  fullData
      }
  
    } catch (error) {
      return await customHandlerCatchException(error, updateRoleDto);    
    }
  }

//Delete Rol
  async remove(id: string) {
    await this.findOne(id);
    
    try {
      await this.rolModel.findByIdAndDelete(id);
      return{
        success: true,
        data: id,
      }
    } catch (error) {
      throw new BadRequestException(
        {
          success: false,
          message: ERR_MSG_GENERAL
        }
      )
    }

  }
}

