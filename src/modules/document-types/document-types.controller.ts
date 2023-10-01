import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocumentTypesService } from './document-types.service';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { Auth } from 'src/common/decorators/auth.decorator';
import { EValidRoles } from 'src/utils/interfaces';

@Controller('document-types')
export class DocumentTypesController {
  constructor(private readonly documentTypesService: DocumentTypesService) {}

  @Post()
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  create(@Body() createDocumentTypeDto: CreateDocumentTypeDto) {
    return this.documentTypesService.create(createDocumentTypeDto);
  }

  @Get()
  @Auth()
  findAll() {
    return this.documentTypesService.findAll();
  }

  @Get(':id')
  @Auth()
  findOne(@Param('id') id: string) {
    return this.documentTypesService.findOne(id);
  }

  @Patch(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  update(@Param('id') id: string, @Body() updateDocumentTypeDto: UpdateDocumentTypeDto) {
    return this.documentTypesService.update(id, updateDocumentTypeDto);
  }

  @Delete(':id')
  @Auth(EValidRoles.superadmin, EValidRoles.admin)
  remove(@Param('id') id: string) {
    return this.documentTypesService.remove(id);
  }
}
