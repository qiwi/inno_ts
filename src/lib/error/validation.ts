import {InnoError} from "./error";

export class ValidationError extends InnoError {
    public name = 'ValidationError';
    public errorPrefix = 'ERROR_VALIDATION_';

    constructor(code: string, internalLogObject: any = {}, httpStatus: number = 400) {
        super(code, internalLogObject, httpStatus);
        this.code = this.errorPrefix + code;
    }
}