import {BaseError, IInnoErrorOptions} from "./base";
import * as Koa from 'koa';
import Context = Koa.Context;

export class AuthError extends BaseError {
    static readonly TOKEN_IS_INVALID: TAuthErrorCode = 'TOKEN_IS_INVALID';
    static readonly AUTH_REJECTED: TAuthErrorCode = 'AUTH_REJECTED';

    static defaultOptions: IInnoErrorOptions = {
        code: AuthError.TOKEN_IS_INVALID,
        status: 401
    };

    /**
     * Constructs new instance of AuthError
     * @param {TAuthErrorCode} code
     * @param {Context} [headers] If passed, headers from context are saved to error inner details.
     */
    constructor(code: TAuthErrorCode, headers: any = {}) {
        super(Object.assign(
            {},
            AuthError.defaultOptions,
            {
                code,
                innerDetails: headers
            })
        );

        this.errorPrefix = 'ERROR_AUTH_';
        this.code = this.errorPrefix + code;
    }
}

export type TAuthErrorCode = 'TOKEN_IS_INVALID' | 'AUTH_REJECTED';