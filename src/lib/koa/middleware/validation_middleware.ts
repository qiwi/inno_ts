import {IMiddleware} from 'koa-router';
import * as joi from 'joi';
import * as koa from 'koa';
import {ValidationError} from '../../error/validation';
import * as _ from 'lodash';

export function createValidationMiddleware(schema: joi.ObjectSchema): IMiddleware {
    return function(ctx: koa.Context, next: () => any): void {
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

        const result = schema.validate<any>(params);

        if (result.error) {
            const invalidKey = _.get<string>(result.error, 'details.0.path');
            const invalidValue = params[invalidKey];
            const message = _.get<string>(result.error, 'details.0.message');
            throw new ValidationError(
                ValidationError.DEFAULT,
                invalidKey,
                invalidValue,
                message
            );
        }

        Object.assign(params, result.value);

        next();
    };
}