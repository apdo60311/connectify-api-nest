import { IsString, IsEmail, MinLength, IsOptional, IsUrl, IsEnum, IsDateString, IsNotEmpty } from 'class-validator';
import { UserRole } from 'src/common/enums/user-role.enum';


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    readonly username: string

    @IsString()
    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    readonly password: string

    @IsString()
    @IsNotEmpty()
    readonly firstName: string

    @IsString()
    @IsNotEmpty()
    readonly lastName: string

    @IsDateString()
    @IsOptional()
    readonly dateOfBirth?: Date

    @IsEnum(UserRole)
    @IsNotEmpty()
    readonly role?: string

    @IsOptional()
    @IsString()
    readonly bio?: string;

    @IsOptional()
    @IsString()
    readonly location?: string;

    @IsOptional()
    @IsUrl()
    readonly website?: string;

    @IsOptional()
    @IsUrl()
    readonly profilePhoto?: string;
}

