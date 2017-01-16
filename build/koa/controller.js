"use strict";
const item_validator_1 = require("../validation/item_validator");
exports.STATUS_SUCCESS = 200;
exports.DEFAULT_SUCCESS_PAYLOAD = 'success';
class Controller {
    validateQuery(ctx, cb) {
        return cb(this.__validate(ctx.request.query));
    }
    ;
    validateBody(ctx, cb) {
        return cb(this.__validate(ctx.request.body));
    }
    ;
    __validate(item) {
        return new item_validator_1.ItemValidator(item);
    }
    ;
}
exports.Controller = Controller;
