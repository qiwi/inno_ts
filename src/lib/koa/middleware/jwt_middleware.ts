import * as jwt from "koa-jwt";

export function createJwtMiddleware(
    jwtSecret: string,
    appUnprotectedUrlsRegexp: string,
    jwtAuthHeaderPrefix: string = 'Bearer'
): (...args: any[]) => Promise<void> {
    return jwt({
        secret: jwtSecret,
        getToken: function (opts: any): null | string {
            const ctx = this;
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
        }
    }).unless({
        path: [
            new RegExp(appUnprotectedUrlsRegexp)
        ],
        method: 'OPTIONS'
    });
}