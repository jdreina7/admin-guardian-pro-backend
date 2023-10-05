import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

import { ContractorsService } from './contractors.service';
import { CreateContractorDto } from './dto/create-contractor.dto';
import { UpdateContractorDto } from './dto/update-contractor.dto';
import { Auth } from './../../common/decorators/auth.decorator';
import { EValidRoles } from './../../utils/interfaces';

@Controller('contractors')
export class ContractorsController {
  constructor(private readonly contractorsService: ContractorsService) {}

  @Post()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  create(@Body() createContractorDto: CreateContractorDto) {
    return this.contractorsService.create(createContractorDto);
  }

  @Get()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  findAll() {
    return this.contractorsService.findAll();
  }

  @Get(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  findOne(@Param('id') id: string) {
    return this.contractorsService.findOne(id);
  }

  @Patch(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  update(@Param('id') id: string, @Body() updateContractorDto: UpdateContractorDto) {
    return this.contractorsService.update(id, updateContractorDto);
  }

  @Delete(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.contractorsService.remove(id);
  }
}
