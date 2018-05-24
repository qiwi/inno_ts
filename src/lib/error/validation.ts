import {BaseError, IInnoErrorOptions} from "./base";

export interface IValidationErrorDetails {
    invalidField: string;
    invalidValue: any;
}

export class ValidationError extends BaseError {
    static readonly DEFAULT: TValidationErrorCode = 'FAILED';
    static readonly VALIDATION: TValidationErrorCode = 'VALIDATION';

    static readonly NO_STRING: TValidationErrorCode = 'NO_STRING';
    static readonly NO_INT: TValidationErrorCode = 'NO_INT';
    static readonly NO_NUMBER: TValidationErrorCode = 'NO_NUMBER';
    static readonly NO_EMAIL: TValidationErrorCode = 'NO_EMAIL';
    static readonly NO_ARRAY: TValidationErrorCode = 'NO_ARRAY';
    static readonly NO_DATE: TValidationErrorCode = 'NO_DATE';

    static readonly INT_OUT_OF_BOUNDS: TValidationErrorCode = 'INT_OUT_OF_BOUNDS';
    static readonly NUMBER_OUT_OF_BOUNDS: TValidationErrorCode = 'NUMBER_OUT_OF_BOUNDS';
    static readonly STRING_OUT_OF_BOUNDS: TValidationErrorCode = 'STRING_OUT_OF_BOUNDS';
    static readonly DATE_OUT_OF_BOUNDS: TValidationErrorCode = 'DATE_OUT_OF_BOUNDS';

    static defaultOptions: IInnoErrorOptions = {
        code: ValidationError.VALIDATION,
        innerDetails: {},
        details: {},
        status: BaseError.CODE_BAD_REQUEST
    };

    public details: IValidationErrorDetails;

    constructor(
        code: TValidationErrorCode = ValidationError.DEFAULT,
        invalidField?: string,
        invalidValue?: any,
        message?: string,
        type?: string
    ) {
        const details: any = {invalidField, invalidValue};
        if (message) {
            details.message = message;
        }

        if (type) {
            details.type = type;
        }
        super(Object.assign({}, ValidationError.defaultOptions, {
            code,
            details
        }));

        this.errorPrefix = 'ERROR_VALIDATION_';
        this.code = this.errorPrefix + code;
    }
}

export type TValidationErrorCode = 'FAILED' | 'VALIDATION' | 'NO_STRING' |
    'NO_INT' | 'NO_EMAIL' | 'INT_OUT_OF_BOUNDS' | 'STRING_OUT_OF_BOUNDS' | 'NO_ARRAY' | 'NO_NUMBER'
    | 'NUMBER_OUT_OF_BOUNDS' | 'NO_DATE' | 'DATE_OUT_OF_BOUNDS';