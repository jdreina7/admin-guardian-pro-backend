import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { VALID_CREDENTIALS } from 'src/utils/contants';

export class CreateIdentificationDto {
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
