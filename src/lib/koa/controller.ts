import {Context} from 'koa';
import {ItemValidator} from '../validation/item_validator';

export abstract class Controller {
    validate(ctx: Context, cb: (ItemValidator: ItemValidator) => any): any {
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
        return cb(this._validate(params));
    }

    protected _validate(item: any): ItemValidator {
        return new ItemValidator(item);
    };
}