import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { IdentificationsService } from './identification.service';
import { CreateIdentificationDto } from './dto/create-identification.dto';
import { UpdateIdentificationDto } from './dto/update-identification.dto';

@Controller('identifications')
export class IdentificationsController {
  constructor(private readonly identificationService: IdentificationsService) {}

  @Post()
  create(@Body() createIdentificationDto: CreateIdentificationDto) {
    return this.identificationService.create(createIdentificationDto);
  }

  @Get()
  findAll() {
    return this.identificationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.identificationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateIdentificationDto: UpdateIdentificationDto) {
    return this.identificationService.update(id, updateIdentificationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.identificationService.remove(id);
  }
}
