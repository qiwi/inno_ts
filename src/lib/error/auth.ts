import {InnoError, IInnoErrorOptions} from "./error";

export class AuthError extends InnoError {
    static readonly TOKEN_IS_INVALID: string = 'TOKEN_IS_INVALID';
    static readonly AUTH_REJECTED: string = 'AUTH_REJECTED';

    static defaultOptions: IInnoErrorOptions = {
        code: AuthError.TOKEN_IS_INVALID,
        innerDetails: {},
        details: {},
        status: 401
    };

    constructor(options: IInnoErrorOptions = {}) {
        super(Object.assign({}, AuthError.defaultOptions, options));

        this.errorPrefix = 'ERROR_AUTH_';
        this.code = this.errorPrefix + (options.code || AuthError.defaultOptions.code);
    }
}