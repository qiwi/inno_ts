import {BaseError} from "./base";

export class InnoError extends BaseError {
    constructor(code: string = BaseError.INTERNAL, status?: number, innerDetails: any = {}) {
        super({});
        this.code = this.errorPrefix + code;
        if (status) {
            this.status = status;
        }
        this.innerDetails = innerDetails;
    }
}