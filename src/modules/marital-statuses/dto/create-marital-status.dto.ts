import { IsString, MinLength, IsIn, IsOptional, IsBoolean } from 'class-validator';
import { VALID_MARITAL_STATUSES } from 'src/utils/contants';

export class CreateMaritalStatusDto {
  @IsString()
  @MinLength(1)
  @IsIn(VALID_MARITAL_STATUSES)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
