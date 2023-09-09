import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IdentificationsTypesService } from './identificationTypes.service';
import { CreateIdentificationTypesDto } from './dto/create-identificationTypes.dto';
import { UpdateIdentificationTypesDto } from './dto/update-identificationTypes.dto';

@Controller('identificationstypes')
export class IdentificationsTypesController {
  constructor(private readonly identificationTypesService: IdentificationsTypesService) {}

  @Post()
  create(@Body() createIdentificationTypesDto: CreateIdentificationTypesDto) {
    return this.identificationTypesService.create(createIdentificationTypesDto);
  }

  @Get()
  findAll() {
    return this.identificationTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.identificationTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIdentificationTypesDto: UpdateIdentificationTypesDto) {
    return this.identificationTypesService.update(id, updateIdentificationTypesDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.identificationTypesService.remove(id);
  }
}
