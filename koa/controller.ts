import {Context} from 'koa';
import {ItemValidator} from '../validation/item_validator';
import {ResultError} from "../error";

export const STATUS_SUCCESS: number = 200;
export const STATUS_ERROR: number = 500;
export const DEFAULT_SUCCESS_PAYLOAD: string = 'success';
export const DEFAULT_ERROR_PAYLOAD: string = 'unknown error';

export abstract class Controller {
    public validateQuery(ctx: Context, cb: (ItemValidator) => any): any {
        return cb(this.__validate(ctx.request.query));
    };

    public validateBody(ctx: Context, cb: (ItemValidator) => any): any {
        return cb(this.__validate(ctx.request.body));
    };

    public success(ctx: Context, payload: any = DEFAULT_SUCCESS_PAYLOAD) {
        ctx.status = STATUS_SUCCESS;
        ctx.body = {
            result: payload
        }
    }

    public error(ctx: Context, errorCode: number = STATUS_ERROR, payload: any = DEFAULT_ERROR_PAYLOAD) {
        ctx.status = STATUS_SUCCESS;
        ctx.body = {
            result: payload
        }
    }

    protected __validate(item): ItemValidator {
        return new ItemValidator(item);
    };
}