import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from './../../common/dto/pagination.dto';

import { Auth } from './../../common/decorators/auth.decorator';
import { EValidRoles } from './../../utils/interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
