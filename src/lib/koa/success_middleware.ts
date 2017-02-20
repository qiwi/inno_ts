import {Context} from 'koa';

export async function successMiddleware(ctx: Context, next: Function): Promise<void> {
    if (ctx.body) {
        ctx.body = {
            result: ctx.body
        };
    }
    await next();
}