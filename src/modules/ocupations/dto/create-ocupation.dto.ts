import { IsString, MinLength, IsIn, IsOptional, IsBoolean } from 'class-validator';
import { USER_VALID_OCUPATIONS } from 'src/utils/contants';

export class CreateOcupationDto {
  @IsString()
  @MinLength(1)
  @IsIn(USER_VALID_OCUPATIONS)
  name: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
