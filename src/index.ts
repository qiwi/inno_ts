export * from './lib/validation/item_validator';
export * from './lib/validation/validator';
export * from './lib/koa/middleware/error_middleware';
export * from './lib/koa/controller';
export * from './lib/koa/interfaces';
export * from './lib/koa/app';
export * from './lib/db/pg';
export * from './lib/db/pg_pool';
export * from './lib/error/auth';
export * from './lib/error/inno';
export * from './lib/error/validation';
export {Context} from 'koa';

import * as logger from './lib/logger';
export {logger};

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