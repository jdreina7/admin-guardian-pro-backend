import { IsBoolean, IsDate, IsInt, IsMongoId, IsOptional, IsPositive, IsString, IsUrl, MinDate } from 'class-validator';

export class CreateContractDto {
  @IsInt()
  @IsPositive()
  contractNumber: number;

  @IsString()
  @IsMongoId()
  contractorId: string;

  @IsString()
  @IsMongoId()
  contractHolderuserId: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsUrl()
  contractUrl: string;

  @IsString()
  @IsMongoId()
  createdByUserId: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsInt()
  @IsPositive()
  contractVersion: number;

  @IsString()
  @IsMongoId()
  contractAppendsId: string;

  @IsDate()
  @MinDate(new Date())
  contractStartDate: Date;

  @IsDate()
  @MinDate(new Date())
  contractEndDate: Date;
}
