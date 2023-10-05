import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { GendersService } from './genders.service';
import { CreateGenderDto } from './dto/create-gender.dto';
import { UpdateGenderDto } from './dto/update-gender.dto';
import { EValidRoles } from './../../utils/interfaces';
import { Auth } from './../../common/decorators/auth.decorator';

@Controller('genders')
export class GendersController {
  constructor(private readonly gendersService: GendersService) {}

  @Post()
  @Auth(EValidRoles.superadmin, EValidRoles.admin) // Only admin and superadmin can hit this endpoint
  create(@Body() createGenderDto: CreateGenderDto) {
    return this.gendersService.create(createGenderDto);
  }

  @Get()
  @Auth() // All users can hit this endpoint
  findAll() {
    return this.gendersService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.gendersService.findOne(id);
  }

  @Patch(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  update(@Param('id') id: string, @Body() updateGenderDto: UpdateGenderDto) {
    return this.gendersService.update(id, updateGenderDto);
  }

  @Delete(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.gendersService.remove(id);
  }
}
