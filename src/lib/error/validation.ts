import {InnoError, IInnoErrorOptions} from "./error";

export class ValidationError extends InnoError {
    static readonly VALIDATION: string = 'VALIDATION';

    static readonly NO_STRING: string = 'NO_STRING';
    static readonly NO_INT: string = 'NO_INT';
    static readonly NO_EMAIL: string = 'NO_EMAIL';

    static readonly INT_OUT_OF_BOUNDS: string = 'INT_OUT_OF_BOUNDS';
    static readonly STRING_OUT_OF_BOUNDS: string = 'STRING_OUT_OF_BOUNDS';

    static defaultOptions: IInnoErrorOptions = {
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