export class InnoError extends Error {
    public static readonly INTERNAL = 'INTERNAL';
    public static readonly DB_ERROR = 'DB_ERROR';
    public static readonly AUTH = 'AUTH_TOKEN_IS_INVALID';

    public static readonly NO_STRING = 'NO_STRING';
    public static readonly NO_INT = 'NO_INT';
    public static readonly NO_EMAIL = 'NO_EMAIL';

    public static readonly INT_OUT_OF_BOUNDS = 'NO_INT';
    public static readonly STRING_OUT_OF_BOUNDS = 'NO_INT';

    public errorPrefix = 'ERROR_';

    public name = 'InnoError';

    public message: string;
    public code: string;
    public status: number;
    public logObject: any;

    private static processError(key, value): {} {
        if (value instanceof Error) {
            const error = {};

            Object.getOwnPropertyNames(value).forEach(function (key) {
                error[key] = value[key];
            });

            return error;
        }

        return value;
    }

    public toString() {
        return this.message;
    }

    constructor(code: string, internalLogObject: any = {}, httpStatus: number = 500) {
        super();
        this.code = this.errorPrefix + code;
        this.status = httpStatus;
        this.logObject = internalLogObject;
        this.stack = null;

        this.message = (new Date()).toISOString() + ' An error occurred:' +
            ' \nERROR_CODE: ' + this.code +
            ' \nERROR_HTTP_STATUS: ' + this.status +
            ' \nERROR_LOG_OBJECT: ' + JSON.stringify(this.logObject, InnoError.processError, 2);
    }
}