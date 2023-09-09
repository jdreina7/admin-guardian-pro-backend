import { PartialType } from '@nestjs/mapped-types';
import { CreateIdentificationTypesDto } from './create-identificationTypes.dto';

export class UpdateIdentificationTypesDto extends PartialType(CreateIdentificationTypesDto) {}
