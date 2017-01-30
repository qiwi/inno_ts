import * as validator from 'validator';
import {ResultError} from '../error';

export const VALIDATION_NO_INT = 'VALIDATION_NO_INT';
export const VALIDATION_NO_STRING = 'VALIDATION_NO_STRING';
export const VALIDATION_NO_EMAIL = 'VALIDATION_NO_EMAIL';
export const VALIDATION_INT_OUT_OF_BOUNDS = 'VALIDATION_INT_OUT_OF_BOUNDS';
export const VALIDATION_STRING_OUT_OF_BOUNDS = 'VALIDATION_STRING_OUT_OF_BOUNDS';

export const DEFAULT_CODE = 400;

export class Validator {
    /**
     * Проверяет, что значение - целое число. undefined не принимает.
     */
    static isInt(value: any, min: number = Number.MIN_SAFE_INTEGER, max: number = Number.MAX_SAFE_INTEGER): number | never {
        value = Validator.isString(value);
        if (!isNaN(value) && validator.isInt(value)) {
            value = parseInt(value);

            if (value < max && value > min) {
                return value;
            }

            throw new ResultError(VALIDATION_INT_OUT_OF_BOUNDS, DEFAULT_CODE, value);
        }

        throw new ResultError(VALIDATION_NO_INT, DEFAULT_CODE, value);
    }

    /**
     * Эскейпит строку. Не проверяет наличие.
     */
    static escape(value: string): string {
        return validator.escape(value || '');
    }

    /**
     * Проверяет, что значение - строка, эскейпит, тримит.
     */
    static isString(value: any, min: number = 0, max: number = 256): any | never {
        if (typeof value == 'string') {
            const processedValue = value.trim();
            if (processedValue.length > min && processedValue.length < max) {
                return Validator.escape(processedValue);
            }

            throw new ResultError(VALIDATION_STRING_OUT_OF_BOUNDS, DEFAULT_CODE, value);
        }

        throw new ResultError(VALIDATION_NO_STRING, DEFAULT_CODE, value);
    }

    /**
     * Проверяет, что передан email + lowercase+trim+escape
     */
    static isEmail(value: any): string | never {
        const email = Validator.isString(value).toLowerCase();

        if (validator.isEmail(email)) {
            return email;
        } else {
            throw new ResultError(VALIDATION_NO_EMAIL, DEFAULT_CODE, value);
        }
    }
}