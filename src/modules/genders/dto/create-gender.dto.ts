import { IsString, MinLength, IsIn, IsOptional, IsBoolean } from 'class-validator';
import { VALID_GENDERS } from 'src/utils/contants';

export class CreateGenderDto {
  @IsString()
  @MinLength(1)
  @IsIn(VALID_GENDERS)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
