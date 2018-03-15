import { Middleware } from 'koa';
import * as cors from "koa2-cors";

export function createCorsMiddleware(corsOptions: cors.Options): Middleware {
    return cors(corsOptions);
}