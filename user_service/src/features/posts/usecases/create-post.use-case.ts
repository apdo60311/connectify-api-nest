import { UseCase, UseCaseInput } from "src/utils/user-case";
import { Post } from "../data/entities/post.entity";
import { Repository } from "typeorm";
import { CreatePostDto } from "../dtos/create-post.dto";

export class CreatePostUseCase extends UseCase<Post> {
    constructor(private readonly repository: Repository<Post>) {
        super(repository);
    }
    async execute(usecaseInput: UseCaseInput<CreatePostDto>): Promise<Post> {
        const post: Post = await this.repository.save(this.repository.create(usecaseInput.data));
        return post;
    }
}

