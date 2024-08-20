import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { IPost } from "../../interfaces/post.model";
import { IsArray, IsDateString, IsString, IsUUID } from "class-validator";

@Entity('posts')
export class Post implements IPost {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { nullable: false })
    content: string;

    @Column('array', { nullable: false })
    media: string[];

    @Column('uuid', { nullable: false })
    userId: string;

    @Column('datetime')
    createdAt: Date;

    @Column('datetime')
    updatedAt: Date;
}