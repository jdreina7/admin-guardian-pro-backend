import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MaritalStatusesService } from './marital-statuses.service';
import { CreateMaritalStatusDto } from './dto/create-marital-status.dto';
import { UpdateMaritalStatusDto } from './dto/update-marital-status.dto';

@Controller('marital-statuses')
export class MaritalStatusesController {
  constructor(private readonly maritalStatusesService: MaritalStatusesService) {}

  @Post()
  create(@Body() createMaritalStatusDto: CreateMaritalStatusDto) {
    return this.maritalStatusesService.create(createMaritalStatusDto);
  }

  @Get()
  findAll() {
    return this.maritalStatusesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.maritalStatusesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMaritalStatusDto: UpdateMaritalStatusDto) {
    return this.maritalStatusesService.update(+id, updateMaritalStatusDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.maritalStatusesService.remove(+id);
  }
}
