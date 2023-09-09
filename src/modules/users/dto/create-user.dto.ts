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
  @IsOptional()
  middleName: string;

  @IsString()
  @MinLength(3)
  lastName: string;

  @IsString()
  @IsMongoId()
  genderId: string;

  @IsNumber()
  @IsOptional()
  contactPhone: number;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  city: string;

  @IsString()
  @IsOptional()
  birthday: string;

  @IsString()
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
  roleId: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsString()
  @IsOptional()
  lastLogin: string;
}
