import { IsBoolean, IsInt, IsOptional, IsPositive, IsString, MinLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MinLength(4)
  documentName: string;

  @IsInt()
  @IsPositive()
  documentType: number;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @MinLength(10)
  documentUrl: string;

  @IsInt()
  @IsPositive()
  userOwner: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsString()
  @IsOptional()
  documentVersion: string;
}
