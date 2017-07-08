export interface IAppJwtConfig {
    secret: string;
    publicPath: string;
    prefix?: string;
}

export interface ICorsConfig {
    enabled: boolean;
    origin: string;
    credentials: string;
}

export interface IAppConfig {
    host?: string;
    port: number;
    logLevel?: string;
    jwt?: IAppJwtConfig;
    cors?: ICorsConfig;
    userAgent?: boolean;
}