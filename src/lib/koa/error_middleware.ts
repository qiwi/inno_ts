import {InnoError} from '../error/error';
import {Context} from 'koa';
import {AuthError} from "../error/auth";

export async function errorMiddleware(ctx: Context, next: Function): Promise<void> {
    try {
        await next();
    } catch (err) {
        let error;
        // koa-jwt request error interceptor
        if (err.status == 401) {
            err.stack = ''; // NOTE we don't need stack, we know why this error is thrown
            error = new AuthError({
                innerDetails: {
                    headers: ctx.request.headers
                }
            });
        } else {
            error = err instanceof InnoError ? err : new InnoError({
                innerDetails: err
            });
        }

        console.error(error.toString());
        ctx.status = error.status;

        const result: any = {
            error: error.code
        };

        result.details = error.details;

        ctx.body = result;
    }
}