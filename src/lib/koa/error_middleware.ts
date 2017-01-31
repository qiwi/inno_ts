import {InnoError} from '../error/error';
import {Context} from 'koa';
import {ValidationError} from "../error/validation";

export async function errorMiddleware(ctx: Context, next: Function): Promise<void> {
    try {
        await next();
    } catch (err) {
        let error;
        // TODO move common error codes to single place
        // koa-jwt request error interceptor
        if (err.status == 401) {
            error = new InnoError(InnoError.AUTH, err, 401);
        } else {
            error = err instanceof InnoError ? err : new InnoError(InnoError.INTERNAL, err);
        }

        console.error(error.toString());
        ctx.status = error.status;

        const result: any = {
            error: error.code
        };

        if (error instanceof ValidationError) {
            result.additionalInfo = error.logObject;
        }

        ctx.body = result;
    }
}