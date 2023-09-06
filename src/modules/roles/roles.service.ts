import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';


import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './entities/role.entity';
import { customHandlerCatchException } from 'src/utils/utils';
import { ERR_MSG_INVALID_VALUE } from 'src/utils/contants';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Rol.name) private readonly rolModel: Model<Rol>) {}

  async create(createRoleDto: CreateRoleDto) {
    createRoleDto.rol = createRoleDto.rol.toLowerCase();

    try {
      const rolCreated = this.rolModel.create(createRoleDto);

      return {
        success: true,
        data: (await rolCreated).rol
      }

    } catch (error) {
      return await customHandlerCatchException(error, createRoleDto);
    }
    
  }

  findAll() {
    return `This action returns all roles`;
  }

  async findOne(id: string) {
    
    if ( !isValidObjectId( id ) ) {
      throw new BadRequestException({
        success: false,
        message: ERR_MSG_INVALID_VALUE,
        invalidValue: id,
      });
    }

    const rol: Rol = await this.rolModel.findById( id ) ;

    if (!rol) {
      throw new NotFoundException({
        succes: false,
        message: ERR_MSG_INVALID_VALUE,
        invalidValue: id,
      });
    }

    return {
      success: true,
      data: rol,
    }
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {

    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}

