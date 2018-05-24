import * as validator from 'validator';
import { ValidationError } from "../error/validation";

export class Validator {
    /**
     * @see {ItemValidator.isInt}
     * @param value
     * @param min
     * @param max
     * @returns {any}
     * @throws ValidationError
     */
    static isInt(value: any,
                 min: number = Number.MIN_SAFE_INTEGER,
                 max: number = Number.MAX_SAFE_INTEGER): number | never {
        value = Validator.isNumber(value, min, max);

        // NOTE we convert to string because of validator.js that accepts only strings
        if (!validator.isInt(value.toString())) {
            throw new ValidationError(ValidationError.NO_INT);
        }

        return value;
    }

    static isNumber(value: any,
                    min: number = Number.MIN_SAFE_INTEGER / 128,
                    max: number = Number.MAX_SAFE_INTEGER / 128): number | never {

        value = parseFloat(Validator.isString(value));

        if (!isNaN(value)) {
            if (value >= min && value <= max) {
                return value;
            }

            throw new ValidationError(ValidationError.NUMBER_OUT_OF_BOUNDS);
        }

        throw new ValidationError(ValidationError.NO_NUMBER);
    }

    /**
     * @see {ItemValidator.escape}
     * @param value
     * @returns {any}
     * @throws ValidationError
     */
    static escape(value: string): string {
        return validator.escape(value || '');
    }

    /**
     * @see {ItemValidator.isString}
     * @param value
     * @param min
     * @param max
     * @returns {string}
     * @throws ValidationError
     */
    static isString(value: any, min: number = 1, max: number = 256): string | never {
        if (typeof value === 'number') {
            value = value.toString();
        }

        if (typeof value === 'string') {
            const processedValue = value.trim();
            if (processedValue.length >= min && processedValue.length <= max) {
                return Validator.escape(processedValue);
            }
            throw new ValidationError(ValidationError.STRING_OUT_OF_BOUNDS);
        }

        throw new ValidationError(ValidationError.NO_STRING);
    }

    /**
     * @see {ItemValidator.isEmail}
     * @param value
     * @returns {string}
     * @throws ValidationError
     */
    static isEmail(value: any): string | never {
        const email = Validator.isString(value).toLowerCase();

        if (validator.isEmail(email)) {
            return email;
        } else {
            throw new ValidationError(ValidationError.NO_EMAIL);
        }
    }

    /**
     * @see {ItemValidator.isArray}
     * @param array
     * @param iterator
     * @returns {Array}
     * @throws ValidationError
     */
    static isArray<T>(array: any, iterator?: (arrayElement: any) => T): Array<T> | never {
        if (!(array instanceof Array) || array.length === 0) {
            throw new ValidationError(ValidationError.NO_ARRAY);
        }

        if (typeof iterator === 'function') {
            return array.map((el) => iterator(el));
        }

        return array;
    }

    /**
     * @see {ItemValidator.isDate}
     * @param value
     * @param min
     * @param max
     * @returns {Date}
     * @throws ValidationError
     */
    static isDate(value: any, min?: Date, max?: Date): Date | never {
        const strDate = Validator.isString(value);
        if (!strDate) {
            throw new ValidationError(ValidationError.NO_DATE);
        }

        const isISO8601 = validator.isISO8601(strDate);
        if (!isISO8601) {
            throw new ValidationError(ValidationError.NO_DATE);
        }

        const date = new Date(strDate);
        if (isNaN(date.getTime())) {
            throw new ValidationError(ValidationError.NO_DATE);
        }
        if (min instanceof Date && date.getTime() < min.getTime()) {
            throw new ValidationError(ValidationError.DATE_OUT_OF_BOUNDS);
        }
        if (max instanceof Date && date.getTime() > max.getTime()) {
            throw new ValidationError(ValidationError.DATE_OUT_OF_BOUNDS);
        }

        return date;
    }
}