import { User } from "src/features/user-managment/entities/user.entity";
import { Repository } from "typeorm"

export abstract class UseCase<Type> {
    constructor(repository: Repository<Type>) { }
    abstract execute(usecaseInput: UseCaseInput<Type>): Promise<Type>;
}

export class UseCaseInput<T> {
    constructor(public readonly data: T) { }
}

