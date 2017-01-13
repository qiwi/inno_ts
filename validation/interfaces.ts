export interface IValidator {
    isInt(field: any): any | never;
    escape(field: string): string;
    isString(field: any): any | never;
    isEmail(field: any): string | never;
}