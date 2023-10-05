import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { ContractAppendsService } from './contract-appends.service';
import { CreateContractAppendDto } from './dto/create-contract-append.dto';
import { UpdateContractAppendDto } from './dto/update-contract-append.dto';
import { PaginationDto } from './../../common/dto/pagination.dto';
import { Auth } from './../../common/decorators/auth.decorator';
import { EValidRoles } from './../../utils/interfaces';

@Controller('contract-appends')
export class ContractAppendsController {
  constructor(private readonly contractAppendsService: ContractAppendsService) {}

  @Post()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  create(@Body() createContractAppendDto: CreateContractAppendDto) {
    return this.contractAppendsService.create(createContractAppendDto);
  }

  @Get()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contractAppendsService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.contractAppendsService.findOne(id);
  }

  @Patch(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  update(@Param('id') id: string, @Body() updateContractAppendDto: UpdateContractAppendDto) {
    return this.contractAppendsService.update(id, updateContractAppendDto);
  }

  @Delete(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.contractAppendsService.remove(id);
  }
}
