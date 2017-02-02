import {InnoError, IInnoErrorOptions} from "./error";
import * as Koa from 'koa';
import Context = Koa.Context;

export class AuthError extends InnoError {
    static readonly TOKEN_IS_INVALID: TAuthErrorCode = 'TOKEN_IS_INVALID';
    static readonly AUTH_REJECTED: TAuthErrorCode = 'AUTH_REJECTED';

    static defaultOptions: IInnoErrorOptions = {
        code: AuthError.TOKEN_IS_INVALID,
        status: 401
    };

    /**
     * Constructs new instance of AuthError
     * @param {TAuthErrorCode} code
     * @param {Context} [ctx] If passed, headers from context are saved to error inner details.
     */
    constructor(code: TAuthErrorCode, ctx?: Context) {
        super(Object.assign(
            {},
            AuthError.defaultOptions,
            {
                code,
                innerDetails: ctx ? ctx.request.headers : {}
            })
        );

        this.errorPrefix = 'ERROR_AUTH_';
        this.code = this.errorPrefix + code;
    }
}

export type TAuthErrorCode = 'TOKEN_IS_INVALID' | 'AUTH_REJECTED';