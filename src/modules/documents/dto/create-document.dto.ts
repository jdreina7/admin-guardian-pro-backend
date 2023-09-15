import { IsBoolean, IsMongoId, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MinLength(4)
  documentName: string;

  @IsString()
  @IsMongoId()
  documentTypeId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @MinLength(10)
  documentUrl: string;

  @IsString()
  @IsMongoId()
  userOwnerId: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsString()
  @IsOptional()
  documentVersion: string;
}
