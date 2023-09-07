import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';


import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './schemas/role.schema';
import { customHandlerCatchException } from 'src/utils/utils';
import { ERR_MSG_DATA_NOT_FOUND, ERR_MSG_GENERAL, ERR_MSG_INVALID_PAYLOAD, ERR_MSG_INVALID_VALUE, SUCC_MSG_GENERAL } from 'src/utils/contants';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Rol.name) private readonly rolModel: Model<Rol>) {}

// Create a rol
  async create(createRoleDto: CreateRoleDto) {
    createRoleDto.name = createRoleDto.name.toLowerCase();

    try {
      const rolCreated = this.rolModel.create(createRoleDto);

      return {
        success: true,
        message: SUCC_MSG_GENERAL,
        data: {rolCreated}
      }

    } catch (error) {
      return await customHandlerCatchException(error, createRoleDto);
    }
    
  }

// Det all roles
  findAll() {
    return `This action returns all roles`;
  }

// Search Rol by Id
  async findOne(id: string) {
    
    if ( !isValidObjectId( id ) ) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_VALUE,
        invalidValue: id,
      });
    }

    const name: Rol = await this.rolModel.findById( id ) ;

    if (!name) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_INVALID_VALUE,
        invalidValue: id,
      });
    }

    return {
      success: true,
      data: name,
    }
  }

// Update Rol
  async update(id: string, updateRoleDto: UpdateRoleDto) {

    const existingRol = await this.findOne(id);

    // Puede estar de mas
    if ( !existingRol ) {
      throw new BadRequestException(ERR_MSG_DATA_NOT_FOUND);
    }
    
    console.log(updateRoleDto);

    if (updateRoleDto?.name?.length <= 0) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_PAYLOAD,
        invalidValue: { ...updateRoleDto },
      });
    }

    try {
      await this.rolModel.findByIdAndUpdate(id, updateRoleDto, {
        new: true,
        success: true,
        data: {... updateRoleDto},
      })
  
    } catch (error) {
      return await customHandlerCatchException(error, updateRoleDto);    
    }
  }

//Delete Rol
  async remove(id: string) {
    const existRol = await this.findOne(id);
    
    try {
      await this.rolModel.findByIdAndDelete(id);
      return{
        success: true,
        message: SUCC_MSG_GENERAL,
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

