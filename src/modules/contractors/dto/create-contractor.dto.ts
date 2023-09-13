import { IsString, IsOptional, IsBoolean, IsMongoId } from 'class-validator';

export class CreateContractorDto {
  @IsString()
  @IsMongoId()
  userId: string;

  @IsOptional()
  @IsBoolean()
  status: boolean;
}
