import * as validator from 'validator';
import {ValidationError} from "../error/validation";

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

            throw new ValidationError({
                code: ValidationError.INT_OUT_OF_BOUNDS
            });
        }

        throw new ValidationError({
            code: ValidationError.NO_INT
        });
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

            throw new ValidationError({
                code: ValidationError.STRING_OUT_OF_BOUNDS
            });
        }

        throw new ValidationError({
            code: ValidationError.NO_STRING
        });
    }

    /**
     * Проверяет, что передан email + lowercase+trim+escape
     */
    static isEmail(value: any): string | never {
        const email = Validator.isString(Validator.isString(value)).toLowerCase();

        if (validator.isEmail(email)) {
            return email;
        } else {
            throw new ValidationError({
                code: ValidationError.NO_EMAIL
            });
        }
    }
}