import { Inject, Injectable } from '@nestjs/common';
import { CONFIG_OPTIONS } from 'src/common/constants/symbols';
import * as fs from "fs"
import * as dotenv from "dotenv";

@Injectable()
export class ConfigurationsService {

    private readonly envConfig: Record<string, any>;

    constructor(@Inject(CONFIG_OPTIONS) options: Record<string, any>) {
        let filePath: string;

        console.log(options)
        if (options.stage === 'PRODUCTION') {
            filePath = `./.env.production`;
        } else {
            filePath = `./.env.development`;
        }

        this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    }

    get = (key: string) => this.envConfig[key];
}

