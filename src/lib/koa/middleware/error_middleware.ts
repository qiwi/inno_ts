import {BaseError} from '../../error/base';
import {Context} from 'koa';
import {AuthError} from "../../error/auth";

export async function errorMiddleware(ctx: Context, next: () => any): Promise<void> {
    try {
        await next();
    } catch (err) {
        console.error('Error middleware caught an error:', err.toString());
        let error: BaseError;

        if (err instanceof BaseError) {
            error = err;
        } else if (err.status === 401) {
            // Auth errors (e.g. koa-jwt errors) interceptor
            error = new AuthError(
                AuthError.TOKEN_IS_INVALID,
                process.env.NODE_ENV === 'development' ? ctx.request.headers : {}
            );
        } else {
            // Other errors interceptor
            error = new BaseError({
                innerDetails: err
            });
        }

        console.error('Error middleware mapped an error:', error.toString());
        ctx.status = error.status;

        const result: any = {
            error: error.code
        };

        result.details = error.details;

        ctx.body = result;
    }
}