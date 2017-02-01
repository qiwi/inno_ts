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

export class InnoError extends Error {
    static readonly INTERNAL: string = 'INTERNAL';
    static defaultOptions: IInnoErrorOptions = {
        code: InnoError.INTERNAL,
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
            ' \nERROR_INNER_DETAILS: ' + this._getInnerDetails() +
            ' \nERROR_DETAILS: ' + this._getDetails();
    }

    protected innerDetails: any;

    constructor(options: IInnoErrorOptions = {}) {
        super();
        this.name = this.constructor.name;

        const processedOptions = Object.assign({}, InnoError.defaultOptions, options);

        this.code = this.errorPrefix + processedOptions.code;
        this.status = processedOptions.status;
        this.details = processedOptions.details;
        this.innerDetails = processedOptions.innerDetails;
    }

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

    private _getInnerDetails(): any {
        return JSON.stringify(this.innerDetails, this._jsonReplacer, 2);
    }

    private _getDetails(): any {
        return JSON.stringify(this.details, this._jsonReplacer, 2);
    }
}