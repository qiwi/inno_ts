export declare const VALIDATION_NO_INT = "VALIDATION_NO_INT";
export declare const VALIDATION_NO_STRING = "VALIDATION_NO_STRING";
export declare const VALIDATION_NO_EMAIL = "VALIDATION_NO_EMAIL";
export declare const DEFAULT_CODE = 400;
export declare class Validator {
    static isInt(value: any): any | never;
    static escape(value: string): string;
    static isString(value: any): any | never;
    static isEmail(value: any): string | never;
}
