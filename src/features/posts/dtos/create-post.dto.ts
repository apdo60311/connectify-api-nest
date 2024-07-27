import { IsArray, IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { IPost } from "../interfaces/post.model";

export class CreatePostDto implements IPost {
    @IsNotEmpty()
    @IsUUID()
    id: string;

    @IsNotEmpty()
    @IsString({ each: true })
    content: string;

    @IsNotEmpty()
    @IsArray()
    @IsString({ each: true })
    media: string[];

    @IsNotEmpty()
    @IsUUID()
    userId: string;

    @IsNotEmpty()
    @IsDateString()
    createdAt: Date;

    @IsNotEmpty()
    @IsDateString()
    updatedAt: Date;
}