import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { VALID_DOCUMENT_TYPES } from 'src/utils/contants';

export class CreateDocumentTypeDto {
  @IsString()
  @MinLength(2)
  @IsIn(VALID_DOCUMENT_TYPES)
  type: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
