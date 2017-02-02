import {InnoError} from "./error";

export class DefaultError extends InnoError {
    constructor(code: string, status?: number, innerDetails: any = {}) {
        super({});
        this.code = this.errorPrefix + code;
        if (status) {
            this.status = status;
        }
        this.innerDetails = innerDetails;
    }
}