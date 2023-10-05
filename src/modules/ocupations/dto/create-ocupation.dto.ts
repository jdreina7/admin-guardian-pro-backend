import { IsString, MinLength, IsIn, IsOptional, IsBoolean } from 'class-validator';
import { VALID_OCUPATIONS } from './../../../utils/contants';

export class CreateOcupationDto {
  @IsString()
  @MinLength(1)
  @IsIn(VALID_OCUPATIONS)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
