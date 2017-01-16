/// <reference types="koa" />
import { Context } from 'koa';
import { ItemValidator } from '../validation/item_validator';
export declare const STATUS_SUCCESS: number;
export declare const DEFAULT_SUCCESS_PAYLOAD: string;
export declare abstract class Controller {
    validateQuery(ctx: Context, cb: (ItemValidator) => any): any;
    validateBody(ctx: Context, cb: (ItemValidator) => any): any;
    protected __validate(item: any): ItemValidator;
}
