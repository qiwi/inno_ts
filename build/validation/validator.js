"use strict";
const validator = require("validator");
const error_1 = require("../error");
exports.VALIDATION_NO_INT = 'VALIDATION_NO_INT';
exports.VALIDATION_NO_STRING = 'VALIDATION_NO_STRING';
exports.VALIDATION_NO_EMAIL = 'VALIDATION_NO_EMAIL';
exports.DEFAULT_CODE = 400;
class Validator {
    static isInt(value) {
        if (!isNaN(value) && validator.isInt(value)) {
            return value;
        }
        else {
            throw new error_1.ResultError(exports.VALIDATION_NO_INT, exports.DEFAULT_CODE, value);
        }
    }
    static escape(value) {
        return validator.escape(value || '');
    }
    static isString(value) {
        let processedValue;
        if (typeof value !== 'string' || (processedValue = value.trim()).length === 0) {
            throw new error_1.ResultError(exports.VALIDATION_NO_STRING, exports.DEFAULT_CODE, value);
        }
        return Validator.escape(processedValue);
    }
    static isEmail(value) {
        const email = Validator.isString(value).toLowerCase();
        if (validator.isEmail(email)) {
            return email;
        }
        else {
            throw new error_1.ResultError(exports.VALIDATION_NO_EMAIL, exports.DEFAULT_CODE, value);
        }
    }
}
exports.Validator = Validator;
;
