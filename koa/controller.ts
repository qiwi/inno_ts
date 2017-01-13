import {Context} from 'koa';
import {ItemValidator} from '../validation/item_validator';
import {ResultError} from "../error";

export const STATUS_SUCCESS: number = 200;
export const DEFAULT_SUCCESS_PAYLOAD: string = 'success';

export abstract class Controller {
    public validateQuery(ctx: Context, cb: (ItemValidator) => any): any {
        return cb(this.__validate(ctx.request.query));
    };

    public validateBody(ctx: Context, cb: (ItemValidator) => any): any {
        return cb(this.__validate(ctx.request.body));
    };

    protected __validate(item): ItemValidator {
        return new ItemValidator(item);
    };
}