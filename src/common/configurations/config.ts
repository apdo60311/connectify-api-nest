import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { User } from "src/features/user-managment/entities/user.entity";
import { ConfigKey, Environment } from "./types/configuration-options.type";
import { ConfigModule, ConfigService, registerAs } from "@nestjs/config";
import { ConfigurationsModule } from "./configurations.module";
import { LoginAttemptsEntity } from "src/features/user-managment/auth/entities/login-attempts.entity";

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

export const typeOrmAsyncOptions: TypeOrmModuleAsyncOptions = {
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => {
        return {
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "postgres",
            password: "1967",
            database: "connectify_db",
            synchronize: true,
            logging: false,
            entities: [User, LoginAttemptsEntity]
        }
    },
    inject: [ConfigService],
}


const APPConfig = registerAs(
    ConfigKey.APP, () => ({
        env:
            Environment[process.env.NODE_ENV as keyof typeof Environment] ||
            'development',
        port: Number(process.env.APP_PORT),
        appName: process.env.APP_NAME,
    }),
);

const DBConfig = registerAs(
    ConfigKey.DB, () => ({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    }),
);

export const configurations = [APPConfig, DBConfig];