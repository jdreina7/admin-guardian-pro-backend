import { IsBoolean, IsEmail, IsMongoId, IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  uid: number;

  @IsString()
  @IsMongoId()
  identificationTypeId: string;

  @IsEmail()
  @MinLength(6)
  email: string;

  @IsString()
  @MinLength(3)
  firstName: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  middleName: string;

  @IsString()
  @MinLength(3)
  lastName: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  contactPhone: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  address: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  city: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  birthday: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  userImg: string;

  @IsString()
  @MinLength(5)
  @IsOptional()
  username: string;

  @IsString()
  @MinLength(5)
  password: string;

  @IsString()
  @IsMongoId()
  maritalStatusId: string;

  @IsString()
  @IsMongoId()
  ocupationId: string;

  @IsString()
  @IsMongoId()
  rolId: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsString()
  @MinLength(5)
  @IsOptional()
  lastLogin: string;
}
