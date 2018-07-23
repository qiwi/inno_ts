import {Context} from 'koa';
import {ItemValidator} from '../validation/item_validator';
import {getRequestParamsFromContext} from "./middleware/validation_middleware";

export abstract class Controller {
    validate(ctx: Context, cb: (itemValidator: ItemValidator) => any): any {
        const requestParams = getRequestParamsFromContext(ctx);
        return cb(this._validate(requestParams));
    }

    protected _validate(item: any): ItemValidator {
        return new ItemValidator(item);
    }
}