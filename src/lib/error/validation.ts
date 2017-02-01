import {InnoError, IInnoErrorOptions} from "./error";

export class ValidationError extends InnoError {
    public static readonly VALIDATION = 'VALIDATION';

    public static readonly NO_STRING = 'NO_STRING';
    public static readonly NO_INT = 'NO_INT';
    public static readonly NO_EMAIL = 'NO_EMAIL';

    public static readonly INT_OUT_OF_BOUNDS = 'INT_OUT_OF_BOUNDS';
    public static readonly STRING_OUT_OF_BOUNDS = 'STRING_OUT_OF_BOUNDS';

    public static defaultOptions: IInnoErrorOptions = {
        code: ValidationError.VALIDATION,
        innerDetails: {},
        details: {},
        status: 400
    };

    constructor(options: IInnoErrorOptions = {}) {
        super(Object.assign({}, ValidationError.defaultOptions, options));

        this.errorPrefix = 'ERROR_VALIDATION_';
        this.code = this.errorPrefix + (options.code || ValidationError.defaultOptions.code);
    }
}