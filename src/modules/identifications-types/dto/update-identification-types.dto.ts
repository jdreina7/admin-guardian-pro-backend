import { PartialType } from '@nestjs/mapped-types';
import { CreateIdentificationTypesDto } from './create-identification-types.dto';

export class UpdateIdentificationTypesDto extends PartialType(CreateIdentificationTypesDto) {}
