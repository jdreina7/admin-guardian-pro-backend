import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { VALID_CREDENTIALS } from './../../../utils/contants';

export class CreateIdentificationTypesDto {
  @IsString()
  @MinLength(2)
  @IsIn(VALID_CREDENTIALS)
  type: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
