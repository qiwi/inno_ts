import {Context} from 'koa';
import {ItemValidator} from '../validation/item_validator';

export abstract class Controller {
    validate(ctx: Context, cb: (ItemValidator: ItemValidator) => any): any {
        let params: any;
        if (ctx.request.method === 'GET') {
            params = ctx.request.query;
        } else {
            params = ctx.request.body;
        }
        return cb(this._validate(params));
    }

    protected _validate(item: any): ItemValidator {
        return new ItemValidator(item);
    };
}