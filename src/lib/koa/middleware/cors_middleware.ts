import * as Koa from "koa";
import { Middleware } from 'koa';
import * as koaCorsMiddleware from "@koa/cors";

export interface ICorsOptions {
    origin?: string | ((ctx: Koa.Context) => boolean | string);
    exposeHeaders?: string[];
    maxAge?: number;
    credentials?: boolean;
    allowMethods?: string[];
    allowHeaders?: string[];
}

export function createCorsMiddleware(corsOptions: ICorsOptions): Middleware {
    return koaCorsMiddleware(corsOptions);
}