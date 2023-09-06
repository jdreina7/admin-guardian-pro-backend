import { IsBoolean, IsDate, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { USER_VALID_ROLES } from "src/utils/contants";

export class CreateRoleDto {
    @IsString()
    @MinLength(1)
    @IsIn(USER_VALID_ROLES)
    rol: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    status: boolean;

    @IsOptional()
    @IsDate()
    created_at: string;

    @IsOptional()
    @IsDate()
    updated_at: string;
}
