import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configurations } from "./config";
import { validateConfig } from "./config-validation";


@Module({
    imports: [ConfigModule.forRoot({
        load: [...configurations],
        validate: validateConfig,
        envFilePath: ['.env.development', '.env.production'],
        isGlobal: true,
    }),]
})
export class ConfigurationsModule { }
