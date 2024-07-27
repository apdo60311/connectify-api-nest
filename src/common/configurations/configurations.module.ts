import { DynamicModule, Module } from '@nestjs/common';
import { ConfigurationsService } from './configurations.service';
import { CONFIG_OPTIONS } from 'src/common/constants/symbols';
import { ConfigurationOptions } from './types/configuration-options.type';

@Module({})
export class ConfigurationsModule {
    static register = (options: ConfigurationOptions): DynamicModule => {
        return {
            module: ConfigurationsModule,
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                },
                ConfigurationsService,
            ],
            exports: [ConfigurationsService]
        };
    }
}
