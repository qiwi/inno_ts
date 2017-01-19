import {ResultError} from '../error';
import {Context} from 'koa';

export async function errorMiddleware(ctx: Context, next: Function): Promise<any> {
    try {
        await next();
    } catch (err) {
        const error = ResultError.isError(err) ? err : new ResultError('INTERNAL', 500, err);

        error.log();
        ctx.status = error.status;
        ctx.body = {
            error: error.code
        };
    }
}