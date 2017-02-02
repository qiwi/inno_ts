import {Context} from 'koa';
import {ItemValidator} from '../validation/item_validator';

export abstract class Controller {
    validateQuery(ctx: Context, cb: (ItemValidator: ItemValidator) => any): any {
        return cb(this.__validate(ctx.request.query));
    };

    validateBody(ctx: Context, cb: (ItemValidator: ItemValidator) => any): any {
        return cb(this.__validate(ctx.request.body));
    };

    protected __validate(item: any): ItemValidator {
        return new ItemValidator(item);
    };
}