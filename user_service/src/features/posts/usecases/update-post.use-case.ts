import { UseCase, UseCaseInput } from "src/utils/user-case";
import { Post } from "../data/entities/post.entity";
import { Repository } from "typeorm";
import { UpdatePostDto } from "../dtos/update-post.dto";
import { NotFoundException } from "@nestjs/common/exceptions";

export class CreatePostUseCase extends UseCase<Post> {
    constructor(private readonly repository: Repository<Post>) {
        super(repository);
    }
    async execute(usecaseInput: UseCaseInput<UpdatePostDto>): Promise<Post> {

        const post: Post = await this.repository.findOneBy({ id: usecaseInput.data.id });

        if (!post) {
            throw new NotFoundException(`Post with ID ${usecaseInput.data.id} not found`);
        }

        Object.assign(post, usecaseInput.data);

        return await this.repository.save(usecaseInput.data);
    }
}

