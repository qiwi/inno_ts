export interface IInnoErrorOptions {
    /**
     * Error code. E.g. 'VALIDATION_NO_STRING'.
     */
    code?: string;
    /**
     * Inner details error object.
     */
    innerDetails?: any;
    /**
     * Outer details object, e.g. for passing in response. Contains non-secret info.
     */
    details?: any;
    /**
     * Possible http status for error;
     */
    status?: number;
}

export class BaseError extends Error {
    static readonly INTERNAL: string = 'INTERNAL';
    static defaultOptions: IInnoErrorOptions = {
        code: BaseError.INTERNAL,
        innerDetails: {},
        details: {},
        status: 500
    };
    errorPrefix: string = 'ERROR_';
    code: string;
    details: any;
    status: number;

    get message(): string {
        return (new Date()).toISOString() +
            ' \nERROR_CODE: ' + this.code +
            ' \nERROR_HTTP_STATUS: ' + this.status +
            ' \nERROR_INNER_DETAILS: ' + this._getDetails(this.innerDetails) +
            ' \nERROR_DETAILS: ' + this._getDetails(this.details);
    }

    protected innerDetails: any;

    constructor(options: IInnoErrorOptions = {}) {
        super();
        this.name = this.constructor.name;

        const processedOptions = Object.assign({}, BaseError.defaultOptions, options);

        this.code = this.errorPrefix + processedOptions.code;
        this.status = processedOptions.status;
        this.details = processedOptions.details;
        this.innerDetails = processedOptions.innerDetails;
    }

    /**
     * Workaround for json stringify.
     * JSON.stringify do not processes Error instances, so we pass this method to stringify.
     * @param key
     * @param value
     * @returns {any}
     * @private
     */
    private _jsonReplacer(key: string, value: any): any {
        if (value instanceof Error) {
            const error = {};

            Object.getOwnPropertyNames(value).forEach((key) => {
                error[key] = value[key];
            });

            return error;
        }

        return value;
    }

    private _getDetails(obj: any): string {
        return JSON.stringify(obj, this._jsonReplacer, 2);
    }
}