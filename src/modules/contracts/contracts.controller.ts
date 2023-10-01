import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { EValidRoles } from 'src/utils/interfaces';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  create(@Body() createContractDto: CreateContractDto) {
    return this.contractsService.create(createContractDto);
  }

  @Get()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contractsService.findAll(paginationDto);
  }

  @Get(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  findOne(@Param('id') id: string) {
    return this.contractsService.findOne(id);
  }

  @Patch(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractsService.update(id, updateContractDto);
  }

  @Delete(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.contractsService.remove(id);
  }
}
