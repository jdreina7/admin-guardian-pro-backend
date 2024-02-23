import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @MinLength(6)
  @MaxLength(20)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number',
  })
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

  @IsOptional()
  @IsObject()
  settings?: any;

  @IsOptional()
  @IsArray()
  shortcuts?: string[];

  @IsString()
  @IsOptional()
  loginRedirectUrl: string;
}
