import {Middleware} from 'koa';

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

export interface IAppMiddlewares {
    bodyParser?: Middleware;
    log?: Middleware;
    error?: Middleware;
    jwt?: Middleware;
    cors?: Middleware;
    userAgent?: Middleware;
    success?: Middleware;
}