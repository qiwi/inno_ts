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
    jwt?: IAppJwtConfig;
    cors?: ICorsConfig;
    userAgent?: boolean;
    enableLogMiddleware?: boolean;
    logLevel?: string;
}

export interface IAppMiddlewares {
    trace?: Middleware;
    bodyParser?: Middleware;
    log?: Middleware;
    error?: Middleware;
    jwt?: Middleware;
    cors?: Middleware;
    userAgent?: Middleware;
    success?: Middleware;
}