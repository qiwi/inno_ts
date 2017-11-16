import {IAppConfig, IAppMiddlewares} from '../interfaces';
import * as bodyParser from 'koa-body';
import {logMiddleware} from './log_middleware';
import {errorMiddleware} from './error_middleware';
import {createJwtMiddleware} from './jwt_middleware';
import * as _ from 'lodash';
import {createCorsMiddleware} from './cors_middleware';
import {userAgentMiddleware} from './user_agent_middleware';
import {successMiddleware} from './success_middleware';

export function createDefaultMiddlewareCollection(config: IAppConfig): IAppMiddlewares {
    return {
        bodyParser: bodyParser({multipart: true}),
        log: logMiddleware,
        error: errorMiddleware,
        jwt: createJwtMiddleware(
            _.get(config, 'jwt.secret'), _.get(config, 'jwt.publicPath'), _.get(config, 'jwt.prefix')
        ),
        cors: createCorsMiddleware(
            _.get(config, 'cors.origin'),
            _.get(config, 'cors.credentials')
        ),
        userAgent: userAgentMiddleware,
        success: successMiddleware
    };
}