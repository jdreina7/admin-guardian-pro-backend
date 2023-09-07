import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from "class-validator";
import { USER_VALID_ROLES } from "src/utils/contants";

export class CreateRoleDto {
    @IsString()
    @MinLength(1)
    @IsIn(USER_VALID_ROLES)
    name: string;

    @IsOptional()
    @IsString()
    description: string;

    @IsOptional()
    @IsBoolean()
    status: boolean;
}
