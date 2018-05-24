import { ValidationError } from "../error/validation";
import { Validator } from './validator';

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
    }

    protected _isOptional: boolean;

    constructor(item: any, isOptional: boolean = false) {
        this._item = Object.assign({}, item);
        this._isOptional = isOptional;
    }

    /**
     * Int string check. Escapes, checks and converts to number.
     * @param field
     * @param min
     * @param max
     * @returns {number}
     * @throws ValidationError
     */
    isInt(field: string, min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER): number | never {
        return Validator.isInt(this._item[field], min, max);
    }

    /**
     * Number string check. Escapes, checks and converts to number.
     * @param field
     * @param min
     * @param max
     * @returns {number}
     * @throws ValidationError
     */
    isNumber(// NOTE we restrict too long values by default for float number for floating point use
             field: string, min: number = Number.MIN_SAFE_INTEGER / 128,
             max: number = Number.MAX_SAFE_INTEGER / 128): number | never {

        return Validator.isNumber(this._item[field], min, max);
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
     * @returns {string}
     * @throws ValidationError
     */
    isString(field: string, min: number = 1, max: number = 256): string | never {
        return Validator.isString(this._item[field], min, max);
    }

    /**
     * String email check. Escapes, checks and returns value with string type.
     * @param field
     * @returns {string}
     * @throws ValidationError
     */
    isEmail(field: string): string | never {
        return Validator.isEmail(this._item[field]);
    }

    /**
     * Date checking.
     * @param field
     * @param min
     * @param max
     * @returns {Date}
     * @throws ValidationError
     */
    isDate(field: string, min?: Date, max?: Date): Date | never {
        return Validator.isDate(this._item[field], min, max);
    }

    /**
     * Array checking.
     * @param field
     * @param iterator
     * @returns {Array}
     * @throws ValidationError
     */
    isArray<T>(field: string, iterator?: (arrayElement: any) => T): Array<T> | never {
        return Validator.isArray<T>(this._item[field], iterator);
    }
}

// NOTE !!! Wrapper hack for validator - wraps all ItemValidator methods in try/catch

function wrap(fn: (...args: any[]) => any): (...args: any[]) => any {
    return function(field: string, ...args: Array<any>): any | never {
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
    const value = ItemValidator.prototype[key];
    if (typeof value === 'function' && value.name !== 'constructor') {
        ItemValidator.prototype[key] = wrap(value);
    }
});

export { ItemValidator };