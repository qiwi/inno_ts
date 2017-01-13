import * as validator from 'validator';
import {ResultError} from '../error';

export const VALIDATION_NO_INT = 'VALIDATION_NO_INT';
export const VALIDATION_NO_STRING = 'VALIDATION_NO_STRING';
export const VALIDATION_NO_EMAIL = 'VALIDATION_NO_EMAIL';

export const DEFAULT_CODE = 400;

export class Validator {
    /**
     * Проверяет, что значение - целое число. undefined не принимает.
     */
    static isInt(value: any): any | never {
        if (!isNaN(value) && validator.isInt(value)) {
            return value;
        } else {
            throw new ResultError(VALIDATION_NO_INT, DEFAULT_CODE, value);
        }
    }

    /**
     * Эскейпит строку. Не проверяет наличие.
     */
    static escape(value: string): string {
        return validator.escape(value || '');
    }

    /**
     * Проверяет, что значение - строка, эскейпит, тримит. undefined вызовет ошибку.
     */
    static isString(value: any): any | never {
        let processedValue;
        if (typeof value !== 'string' || (processedValue = value.trim()).length === 0) {
            throw new ResultError(VALIDATION_NO_STRING, DEFAULT_CODE, value);
        }

        return Validator.escape(processedValue);
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


};


/*
 func IsInt(item string) (int) {
 num, err := strconv.Atoi(item)
 checkError(err, "VALIDATION_NOT_INT")
 return num
 }

 func IsCode(item string) (string) {
 isOk, err := regexp.MatchString("^[a-zA-Z0-9_]+$", item)
 checkError(err, "VALIDATION_CODE_REGEXP")

 if (isOk) {
 return item
 }
 sendErrorByCode("VALIDATION_NOT_CODE")
 return ""
 }

 func IsValidStrArr(items []string, validateFunc StringValidator, required bool) []string {
 if (items == nil) {
 if (required){
 sendErrorByCode("NO_VALID_STR_ARR")
 return nil
 }else{
 return make([]string, 0)
 }

 }
 results := make([]string, len(items))
 for i, item := range items {
 results[i] = validateFunc(item)
 }
 return results
 }


 func checkError(err error, errCode string) {
 if err != nil {
 panic(safeerror.New(err, errCode))
 }
 }

 func sendErrorByCode(errCode string) {
 panic(safeerror.NewByCode(errCode))
 }
 */