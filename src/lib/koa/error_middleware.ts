import {ResultError} from '../error';
import {Context} from 'koa';

export async function errorMiddleware(ctx: Context, next: Function): Promise<any> {
    try {
        await next();
    } catch (err) {
        let error;
        // TODO move common error codes to single place
        // koa-jwt request error interceptor
        if (err.status == 401) {
            error = new ResultError('AUTH_TOKEN_IS_INVALID', 401, err);
        } else {
            error = ResultError.isError(err) ? err : new ResultError('INTERNAL', 500, err);
        }

        error.log();
        ctx.status = error.status;
        ctx.body = {
            error: error.code
        };
    }
}