import * as bodyParser from 'koa-body';
import * as _ from 'lodash';
import { IAppConfig, IAppMiddlewares } from '../interfaces';
import { createCorsMiddleware } from './cors_middleware';
import { errorMiddleware } from './error_middleware';
import { createJwtMiddleware } from './jwt_middleware';
import { logMiddleware } from './log_middleware';
import { successMiddleware } from './success_middleware';
import { userAgentMiddleware } from './user_agent_middleware';
import { traceMiddleware} from "./trace_middleware";

export function createDefaultMiddlewareCollection(config: IAppConfig): IAppMiddlewares {
    return {
        trace: traceMiddleware,
        bodyParser: bodyParser({multipart: true}),
        log: logMiddleware,
        error: errorMiddleware,
        jwt: createJwtMiddleware(
            _.get(config, 'jwt.secret'), _.get(config, 'jwt.publicPath'), _.get(config, 'jwt.prefix')
        ),
        cors: createCorsMiddleware(
            {
                origin: _.get(config, 'cors.origin'),
                credentials: _.get(config, 'cors.credentials')
            }
        ),
        userAgent: userAgentMiddleware,
        success: successMiddleware
    };
}