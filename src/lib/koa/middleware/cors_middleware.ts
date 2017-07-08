import * as koaCors from 'koa-cors';
import {Context} from 'koa';

export function createCorsMiddleware(
    origin: string,
    credentials: string
): (ctx: Context, next?: () => any) => any {
    const corsConfig: any = {
        origin: '*'
    };

    if (origin) {
        corsConfig.origin = origin;
    }

    if (credentials) {
        corsConfig.credentials = credentials;
    }

    return koaCors(corsConfig);
}