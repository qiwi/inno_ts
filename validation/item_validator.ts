import {Validator} from './validator';
import {IValidator} from "./interfaces";

//TODO добавить здесь обертку для возврата поля, которое не прошло валидацию
export class ItemValidator implements IValidator {
    item: {};

    constructor(item) {
        this.item = item;
    }

    /**
     * Проверяет, что значение - целое число. undefined не принимает.
     */
    isInt(field: any): any | never {
        return Validator.isInt(this.item[field]);
    }

    /**
     * Эскейпит строку. Не проверяет наличие.
     */
    escape(field: string): string {
        return Validator.escape(this.item[field]);
    }

    /**
     * Проверяет, что значение - строка, эскейпит, тримит. undefined вызовет ошибку.
     */
    isString(field: any): any | never {
        return Validator.isString(this.item[field]);
    }

    /**
     * Проверяет, что передан email + lowercase+trim+escape
     */
    isEmail(field: any): string | never {
        return Validator.isEmail(this.item[field]);
    }
}