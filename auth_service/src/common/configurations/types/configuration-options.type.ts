export type ConfigurationOptions = {
    environment: Environment
}

export enum Environment {
    DEVELOPMENT = 'development',
    PRODUCTION = 'production',
    STAGING = 'staging'
}

export enum ConfigKey {
    APP = 'app',
    DB = 'db',
}