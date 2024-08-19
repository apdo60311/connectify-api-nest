import { IsString, IsOptional, IsUrl, IsDateString, IsBoolean, IsNumber } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    readonly name?: string;

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

    @IsOptional()
    @IsString()
    readonly resetPasswordToken?: string;

    @IsOptional()
    @IsDateString()
    readonly resetPasswordExpires?: Date;

    @IsOptional()
    @IsBoolean()
    readonly isVerified?: boolean;

    @IsOptional()
    @IsString()
    readonly verificationToken?: string;

    @IsOptional()
    @IsNumber()
    readonly verificationExpires?: number;

}
