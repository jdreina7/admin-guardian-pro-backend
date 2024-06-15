import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { Auth } from './../../common/decorators/auth.decorator';
import { EValidRoles } from './../../utils/interfaces';
import { LoginDto } from './dto/login.dto';
import { LoginService } from './login.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService, private readonly loginService: LoginService) {}

  @Post('/login')
  login(@Body() loginDto: LoginDto) {
    return this.loginService.login(loginDto);
  }

  @Post()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  findAll() {
    return this.usersService.findAll();
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
