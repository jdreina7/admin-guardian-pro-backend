import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IdentificationsTypesService } from './identificationTypes.service';
import { CreateIdentificationTypesDto } from './dto/create-identificationTypes.dto';
import { UpdateIdentificationTypesDto } from './dto/update-identificationTypes.dto';
import { Auth } from './../../common/decorators/auth.decorator';
import { EValidRoles } from './../../utils/interfaces';

@Controller('identificationstypes')
export class IdentificationsTypesController {
  constructor(private readonly identificationTypesService: IdentificationsTypesService) {}

  @Post()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  create(@Body() createIdentificationTypesDto: CreateIdentificationTypesDto) {
    return this.identificationTypesService.create(createIdentificationTypesDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.identificationTypesService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.identificationTypesService.findOne(id);
  }

  @Patch(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  update(@Param('id') id: string, @Body() updateIdentificationTypesDto: UpdateIdentificationTypesDto) {
    return this.identificationTypesService.update(id, updateIdentificationTypesDto);
  }

  @Delete(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.identificationTypesService.remove(id);
  }
}
