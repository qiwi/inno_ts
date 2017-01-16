"use strict";
const validator_1 = require("./validator");
class ItemValidator {
    constructor(item) {
        this.item = item;
    }
    isInt(field) {
        return validator_1.Validator.isInt(this.item[field]);
    }
    escape(field) {
        return validator_1.Validator.escape(this.item[field]);
    }
    isString(field) {
        return validator_1.Validator.isString(this.item[field]);
    }
    isEmail(field) {
        return validator_1.Validator.isEmail(this.item[field]);
    }
}
exports.ItemValidator = ItemValidator;
