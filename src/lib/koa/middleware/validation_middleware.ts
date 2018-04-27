import {IMiddleware} from 'koa-router';
import * as joi from 'joi';
import * as koa from 'koa';
import {ValidationError} from '../../error/validation';
import * as _ from 'lodash';
import * as camelCase from 'camelcase-object';
import * as validator from 'validator';

const customJoi: any = joi.extend((joi) => ({
    base: joi.string(),
    name: 'string',
    pre(value: any, state: any, options: any): any {
        if (options.convert) {
            return validator.escape(value);
        }

        return value;
    }
})).extend((joi) => ({
    base: joi.string(),
    name: 'unescapedString',
    pre(value: any, state: any, options: any): any {
        return validator.unescape(value);
    }
}));

export {customJoi};

const defaultOptions = {
    stripUnknown: true
};

export function createValidationMiddleware(schema: joi.ObjectSchema): IMiddleware {
    return async function(ctx: koa.Context, next: () => any): Promise<void> {
        let params: any;
        if (ctx.request.method === 'GET') {
            params = ctx.request.query;
        } else {
            const contentType = ctx.req.headers['content-type'];
            if (!contentType || contentType.indexOf('application/json') > -1) {
                params = ctx.request.body;
            } else if (contentType.indexOf('multipart/form-data') > -1 && ctx.request.body.fields) {
                params = ctx.request.body.fields;
            } else {
                params = ctx.request.body;
            }
        }

        const result = customJoi.validate(params, schema, defaultOptions);

        if (result.error) {
            const type = _.get<string>(result.error, 'details.0.type');
            const invalidKey = _.get<string>(result.error, 'details.0.path.0');
            const invalidValue = params[invalidKey];
            const message = _.get<string>(result.error, 'details.0.message');
            throw new ValidationError(
                ValidationError.DEFAULT,
                invalidKey,
                invalidValue,
                message,
                type
            );
        }

        ctx.validatedData = {
            originalCase: result.value,
            camelCase: camelCase(result.value)
        };

        await next();
    };
}