import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/features/user-managment/entities/user.entity";

export const postgressConfig: TypeOrmModuleOptions = {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "1967",
    database: "connectify_db",
    synchronize: true,
    logging: false,
    entities: [User]
}  
