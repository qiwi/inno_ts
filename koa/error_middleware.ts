import {ResultError} from '../error';
import {Context} from 'koa';

export async function errorMiddleware(ctx: Context, next: Function): Promise<any> | never {
    try {
        await next();
    } catch (err) {
        const error = ResultError.isError(err) ? err : new ResultError('INTERNAL', 500, err);

        error.log();
        ctx.status = parseInt(error.status);
        ctx.body = {
            status: 'error',
            code: error.code
        };
    }
}