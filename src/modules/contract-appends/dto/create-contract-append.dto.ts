import { IsString, MinLength, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

export class CreateContractAppendDto {
  @IsString()
  @MinLength(5)
  title: string;

  @IsString()
  @MinLength(25)
  content: string;

  @IsOptional()
  @IsString()
  attach: string;

  @IsString()
  @IsMongoId()
  createdByUserId: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
