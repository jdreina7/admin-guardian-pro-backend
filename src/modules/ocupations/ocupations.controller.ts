import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OcupationsService } from './ocupations.service';
import { CreateOcupationDto } from './dto/create-ocupation.dto';
import { UpdateOcupationDto } from './dto/update-ocupation.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { EValidRoles } from 'src/utils/interfaces';

@Controller('ocupations')
export class OcupationsController {
  constructor(private readonly ocupationsService: OcupationsService) {}

  @Post()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  create(@Body() createOcupationDto: CreateOcupationDto) {
    return this.ocupationsService.create(createOcupationDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.ocupationsService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.ocupationsService.findOne(id);
  }

  @Patch(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  update(@Param('id') id: string, @Body() updateOcupationDto: UpdateOcupationDto) {
    return this.ocupationsService.update(id, updateOcupationDto);
  }

  @Delete(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.ocupationsService.remove(id);
  }
}
