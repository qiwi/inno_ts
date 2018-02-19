import * as jwt from "koa-jwt";
import { Context, Middleware } from 'koa';

export const DEFAULT_SECRET = 'default';
export const DEFAULT_REGEXP = '/public/';
export const DEFAULT_PREFIX = 'Bearer';

export function createJwtMiddleware(
    jwtSecret: string = DEFAULT_SECRET,
    appUnprotectedUrlsRegexp: string = DEFAULT_REGEXP,
    jwtAuthHeaderPrefix: string = DEFAULT_PREFIX
): Middleware {
    return jwt({
        secret: jwtSecret,
        // typedef is broken in koa-jwt so any here is
        getToken: function(ctx: Context, opts: any): null | string {
            if (!ctx.header || !ctx.header.authorization) {
                return;
            }

            const parts = ctx.header.authorization.split(' ');

            if (parts.length === 2) {
                const scheme = parts[0];
                const credentials = parts[1];

                if (scheme === jwtAuthHeaderPrefix) {
                    return credentials;
                }
            }
            if (!opts.passthrough) {
                ctx.throw(401, 'Bad Authorization header format. Format is "Authorization: Bearer <token>"');
            }
        } as any
    }).unless({
        path: [
            new RegExp(appUnprotectedUrlsRegexp)
        ],
        method: 'OPTIONS'
    });
}