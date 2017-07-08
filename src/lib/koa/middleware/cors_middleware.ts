import * as koaCors from 'koa-cors';


export function createCorsMiddleware(origin: string, credentials: string): (...args: any[]) => any {
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