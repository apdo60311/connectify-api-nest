import { IsArray, IsDateString, IsOptional, IsString, IsUUID } from "class-validator";
import { IPost } from "../interfaces/post.model";

export class UpdatePostDto implements IPost {
    @IsOptional()
    @IsUUID()
    id: string;

    @IsOptional()
    @IsString({ each: true })
    content: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    media: string[];

    @IsOptional()
    @IsUUID()
    userId: string;

    @IsOptional()
    @IsDateString()
    createdAt: Date;

    @IsOptional()
    @IsDateString()
    updatedAt: Date;
}