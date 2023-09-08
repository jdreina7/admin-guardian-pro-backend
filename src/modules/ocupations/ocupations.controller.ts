import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OcupationsService } from './ocupations.service';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';

@Controller('ocupations')
export class OcupationsController {
  constructor(private readonly ocupationsService: OcupationsService) {}

  @Post()
  create(@Body() createOcupationDto: CreateOcupationDto) {
    return this.ocupationsService.create(createOcupationDto);
  }

  @Get()
  findAll() {
    return this.ocupationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ocupationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOcupationDto: UpdateOcupationDto) {
    return this.ocupationsService.update(id, updateOcupationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ocupationsService.remove(id);
  }
}
