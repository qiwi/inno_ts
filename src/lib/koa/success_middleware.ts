import {Context} from 'koa';

export async function successMiddleware(ctx: Context, next: Function): Promise<void> {
    ctx.body = {
        result: ctx.body
    };
    await next();
}