import * as Koa from "koa";
import { Middleware } from 'koa';
import * as koaCorsMiddleware from "@koa/cors";

export interface CorsOptions {
    origin?: string | ((ctx: Koa.Context) => boolean | string);
    exposeHeaders?: string[];
    maxAge?: number;
    credentials?: boolean;
    allowMethods?: string[];
    allowHeaders?: string[];
}

export function createCorsMiddleware(corsOptions: CorsOptions): Middleware {
    return koaCorsMiddleware(corsOptions);
}