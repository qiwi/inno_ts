import * as Joi from 'joi';
import * as logger from './lib/logger';

declare module "koa" {
    /* tslint:disable */
    interface Context {
        /* tslint:enable */
        validatedData: {
            originalCase: any;
            camelCase: any;
        };
    }
}

export * from './lib/services/cls_service';
export * from './lib/trace';
export * from './lib/decorators/graphite';
export * from './lib/decorators/trace_span';
export * from './lib/validation/item_validator';
export * from './lib/validation/validator';
export * from './lib/koa/middleware/error_middleware';
export * from './lib/koa/controller';
export * from './lib/koa/services/jwt_service';
export * from './lib/koa/interfaces';
export * from './lib/koa/app';
export * from './lib/db/pg';
export * from './lib/db/pg_pool';
export * from './lib/error/auth';
export * from './lib/error/inno';
export * from './lib/error/validation';
export { Context, Middleware, Request, Response } from 'koa';

export { logger, Joi };

/* tslint:disable */
function __export(m) {
    for (let p in m) {
        if (!exports.hasOwnProperty(p)) {
            exports[p] = m[p];
        }
    }
}

try {
    // shitty workaround for an optional dependencies
    // TODO replace with module.resolve
    __export(require('./lib/db/oracle'));
} catch (ex) {
    // TODO
}