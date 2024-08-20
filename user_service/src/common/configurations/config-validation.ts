import { IsDefined, IsEnum, IsNumber, IsString, validateSync } from "class-validator";
import { Environment } from "./types/configuration-options.type";
import { plainToInstance } from "class-transformer";
import { logger } from "src/utils/logger";

export class EnvironmentVariables {
    @IsDefined()
    @IsEnum(Environment)
    NODE_ENV: string;

    @IsDefined()
    @IsString()
    FRONT_END_URL: string

    @IsDefined()
    @IsString()
    JWT_SECRET: string;

    @IsDefined()
    @IsString()
    SESSION_SECRET: string;

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

    @IsDefined()
    @IsNumber()
    THROTTLE_TTL_LONG: number

    @IsDefined()
    @IsNumber()
    THROTTLE_LIMIT_LONG: number

    @IsDefined()
    @IsNumber()
    THROTTLE_TTL_SHORT: number

    @IsDefined()
    @IsNumber()
    THROTTLE_LIMIT_SHORT: number

    @IsDefined()
    @IsString()
    USER_EMAIL: string

    @IsDefined()
    @IsString()
    USER_PASSWORD: string

    @IsDefined()
    @IsNumber()
    MAX_LOGIN_ATTEMPTS: number

    @IsDefined()
    @IsNumber()
    MAX_FAILURE_LOGIN_ATTEMPTS: number

    @IsDefined()
    @IsNumber()
    BLOCK_DURATION: number

    @IsDefined()
    @IsNumber()
    EMAIL_VERIFICATION_DURATION: number

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
