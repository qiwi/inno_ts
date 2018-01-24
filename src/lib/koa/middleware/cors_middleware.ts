import * as koaCors from '@koa/cors';
import {Middleware} from 'koa';

export const DEFAULT_ORIGIN = '*';

export function createCorsMiddleware(
    origin: string = DEFAULT_ORIGIN,
    credentials?: string
): Middleware {
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