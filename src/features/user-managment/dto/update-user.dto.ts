import { IsString, IsOptional, IsUrl } from 'class-validator';

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
}
