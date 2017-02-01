import {InnoError, IInnoErrorOptions} from "./error";

export class AuthError extends InnoError {
    public static readonly TOKEN_IS_INVALID = 'TOKEN_IS_INVALID';
    public static readonly AUTH_REJECTED = 'AUTH_REJECTED';

    public static defaultOptions: IInnoErrorOptions = {
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