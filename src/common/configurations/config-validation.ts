import { IsDefined, IsEnum, IsNumber, IsString, validateSync } from "class-validator";
import { Environment } from "./types/configuration-options.type";
import { plainToClass, plainToInstance } from "class-transformer";
import { logger } from "src/utils/logger";

export class EnvironmentVariables {
    @IsDefined()
    @IsEnum(Environment)
    NODE_ENV: string;

    @IsDefined()
    @IsString()
    JWT_SECRET: string;

    @IsDefined()
    @IsString()
    DB_TYPE: string;

    @IsDefined()
    @IsString()
    DB_HOST: string;

    @IsDefined()
    @IsNumber()
    DB_PORT: number;

    @IsDefined()
    @IsString()
    DB_USERNAME: string;

    @IsDefined()
    @IsString()
    DB_PASSWORD: string;

    @IsDefined()
    @IsString()
    DB_NAME: string;

    @IsDefined()
    @IsString()
    APP_NAME: string;

    @IsDefined()
    @IsString()
    APP_PORT: string;
}

export function validateConfig(configuration: Record<string, any>) {
    const convertedConfig = plainToInstance(EnvironmentVariables, configuration, { enableImplicitConversion: true });

    const errors = validateSync(convertedConfig, { skipMissingProperties: false });


    for (const error of errors) {
        logger.error(`${error.property} is missing!`)
    }

    if (errors.length) {
        throw new Error("Please provide all the Environment Variables.");
    }
    return convertedConfig;
}
