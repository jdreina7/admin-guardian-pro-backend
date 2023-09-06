import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';


import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Rol } from './entities/role.entity';
import { customHandlerCatchException } from 'src/utils/utils';

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

  findOne(id: number) {
    return `This action returns a #${id} role`;
  }

  update(id: number, updateRoleDto: UpdateRoleDto) {
    return `This action updates a #${id} role`;
  }

  remove(id: number) {
    return `This action removes a #${id} role`;
  }
}

