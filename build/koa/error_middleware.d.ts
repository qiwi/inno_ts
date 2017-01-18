/// <reference types="koa" />
import { Context } from 'koa';
export declare function errorMiddleware(ctx: Context, next: Function): Promise<any>;
