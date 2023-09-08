import { IsBoolean, IsIn, IsOptional, IsString, MinLength } from "class-validator"
import { USER_VALID_CREDENTIALS } from "src/utils/contants"

export class CreateCredentialDto {
    @IsString()
    @MinLength(2)
    @IsIn(USER_VALID_CREDENTIALS)
    type: string

    @IsOptional()
    @IsString()
    description: string

    @IsOptional()
    @IsBoolean()
    status: boolean
}
