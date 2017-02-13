import {BaseError, IInnoErrorOptions} from "./base";

export interface IValidationErrorDetails {
    invalidField: string;
    invalidValue: any;
}

export class ValidationError extends BaseError {
    static readonly VALIDATION: TValidationErrorCode = 'VALIDATION';

    static readonly NO_STRING: TValidationErrorCode = 'NO_STRING';
    static readonly NO_INT: TValidationErrorCode = 'NO_INT';
    static readonly NO_EMAIL: TValidationErrorCode = 'NO_EMAIL';

    static readonly INT_OUT_OF_BOUNDS: TValidationErrorCode = 'INT_OUT_OF_BOUNDS';
    static readonly STRING_OUT_OF_BOUNDS: TValidationErrorCode = 'STRING_OUT_OF_BOUNDS';

    static defaultOptions: IInnoErrorOptions = {
        code: ValidationError.VALIDATION,
        innerDetails: {},
        details: {},
        status: BaseError.CODE_BAD_REQUEST
    };

    public details: IValidationErrorDetails;

    constructor(code: TValidationErrorCode, invalidField?: string, invalidValue?: any) {
        super(Object.assign({}, ValidationError.defaultOptions, {
            code,
            details: {
                invalidField,
                invalidValue
            }
        }));

        this.errorPrefix = 'ERROR_VALIDATION_';
        this.code = this.errorPrefix + code;
    }
}

export type TValidationErrorCode = 'VALIDATION' | 'NO_STRING' |
    'NO_INT' | 'NO_EMAIL' | 'INT_OUT_OF_BOUNDS' | 'STRING_OUT_OF_BOUNDS';