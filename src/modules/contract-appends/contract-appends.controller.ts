import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ContractAppendsService } from './contract-appends.service';
import { CreateContractAppendDto } from './dto/create-contract-append.dto';
import { UpdateContractAppendDto } from './dto/update-contract-append.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('contract-appends')
export class ContractAppendsController {
  constructor(private readonly contractAppendsService: ContractAppendsService) {}

  @Post()
  create(@Body() createContractAppendDto: CreateContractAppendDto) {
    return this.contractAppendsService.create(createContractAppendDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.contractAppendsService.findAll(paginationDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.contractAppendsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContractAppendDto: UpdateContractAppendDto) {
    return this.contractAppendsService.update(+id, updateContractAppendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contractAppendsService.remove(+id);
  }
}
