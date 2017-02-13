import {Validator} from './validator';
import {IValidator} from "./interfaces";
import {BaseError} from "../error/base";
import {ValidationError} from "../error/validation";

class ItemValidator implements IValidator {
    item: any;

    constructor(item: any) {
        this.item = item;
    }

    /**
     * Numeric string check. Escapes, checks and converts to number.
     * @param field
     * @param min
     * @param max
     * @returns {number|never}
     */
    isInt(field: any, min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER): string | never {
        return Validator.isInt(this.item[field], min, max);
    }

    /**
     * Escapes string.
     * @param field
     * @returns {string}
     */
    escape(field: string): string {
        return Validator.escape(this.item[field]);
    }

    /**
     * String check. Escapes, checks and returns value with string type.
     * @param field
     * @param min
     * @param max
     * @returns {any|never}
     */
    isString(field: any, min: number = 0, max: number = 256): string | never {
        return Validator.isString(this.item[field], min, max);
    }

    /**
     * String email check. Escapes, checks and returns value with string type.
     * @param field
     * @returns {string|never}
     */
    isEmail(field: any): string | never {
        return Validator.isEmail(this.item[field]);
    }
}
// NOTE !!! Wrapper hack for validator - wraps all ItemValidator methods in try/catch

function wrap(fn: Function): Function {
    return function(field: string): any | never {
        try {
            return fn.apply(this, [].slice.call(arguments, 0));
        } catch (error) {
            const err = error instanceof ValidationError ?
                error :
                new ValidationError(ValidationError.VALIDATION);

            err.details.invalidField = field;
            err.details.invalidValue = this.item[field];

            throw err;
        }
    };
}

Object.getOwnPropertyNames(ItemValidator.prototype).forEach((key: string) => {
    let value = ItemValidator.prototype[key];
    if (typeof value === 'function' && value.name !== 'constructor') {
        ItemValidator.prototype[key] = wrap(value);
    }
});

export {ItemValidator}