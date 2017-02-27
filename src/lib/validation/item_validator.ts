import {Validator} from './validator';
import {ValidationError} from "../error/validation";

class ItemValidator {
    protected _item: any;

    get item(): any {
        return this._item;
    }

    protected _optionalInstance: ItemValidator;

    get optional(): ItemValidator {
        if (!this._optionalInstance) {
            this._optionalInstance = new ItemValidator(this._item, true);
        }
        return this._optionalInstance;
    };

    protected _isOptional: boolean;

    constructor(item: any, isOptional: boolean = false) {
        this._item = item;
        this._isOptional = isOptional;
    }

    /**
     * Numeric string check. Escapes, checks and converts to number.
     * @param field
     * @param min
     * @param max
     * @returns {number|never}
     */
    isInt(field: any, min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER): number | never {
        return Validator.isInt(this._item[field], min, max);
    }

    /**
     * Escapes string.
     * @param field
     * @returns {string}
     */
    escape(field: string): string {
        return Validator.escape(this._item[field]);
    }

    /**
     * String check. Escapes, checks and returns value with string type.
     * @param field
     * @param min
     * @param max
     * @returns {any|never}
     */
    isString(field: any, min: number = 0, max: number = 256): string | never {
        return Validator.isString(this._item[field], min, max);
    }

    /**
     * String email check. Escapes, checks and returns value with string type.
     * @param field
     * @returns {string|never}
     */
    isEmail(field: any): string | never {
        return Validator.isEmail(this._item[field]);
    }
}
// NOTE !!! Wrapper hack for validator - wraps all ItemValidator methods in try/catch

function wrap(fn: Function): Function {
    return function (field: string, ...args: Array<any>): any | never {
        try {
            if (this._isOptional && !this._item.hasOwnProperty(field)) {
                return null;
            }
            return fn.apply(this, [field].concat(args));
        } catch (error) {
            const err = error instanceof ValidationError ?
                error :
                new ValidationError(ValidationError.VALIDATION);

            err.details.invalidField = field;
            err.details.invalidValue = this._item[field];

            throw err;
        }
    };
}

Object.getOwnPropertyNames(ItemValidator.prototype).forEach((key: string) => {
    if (typeof Object.getOwnPropertyDescriptor(ItemValidator.prototype, key).get !== 'undefined') {
        return;
    }
    let value = ItemValidator.prototype[key];
    if (typeof value === 'function' && value.name !== 'constructor') {
        ItemValidator.prototype[key] = wrap(value);
    }
});

export {ItemValidator}