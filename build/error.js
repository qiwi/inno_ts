"use strict";
exports.ERROR_PREFIX = 'ERROR_';
class ResultError {
    static isError(obj) {
        return obj instanceof ResultError;
    }
    constructor(code, httpStatus, internalLogObject) {
        this.code = exports.ERROR_PREFIX + code;
        this.status = httpStatus || 400;
        this.logObject = internalLogObject || {};
    }
    log() {
        console.error((new Date()).toISOString() +
            this.code + ": " + this.status + "\ndata: ", this.logObject);
    }
}
exports.ResultError = ResultError;
