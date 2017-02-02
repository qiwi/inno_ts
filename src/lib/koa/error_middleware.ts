import {InnoError} from '../error/error';
import {Context} from 'koa';
import {AuthError} from "../error/auth";

export async function errorMiddleware(ctx: Context, next: Function): Promise<void> {
    try {
        await next();
    } catch (err) {
        let error: InnoError;

        if (err instanceof InnoError) {
            error = err;
        } else if (err.status === 401) {
            // Auth errors (e.g. koa-jwt errors) interceptor
            error = new AuthError(AuthError.TOKEN_IS_INVALID, ctx);
        } else {
            // Other errors interceptor
            error = new InnoError({
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