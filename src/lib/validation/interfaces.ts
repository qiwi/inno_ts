export interface IValidator {
    isInt(field: any, min?: number, max?: number): number | never;
    escape(field: string): string;
    isString(field: any, min?: number, max?: number): string | never;
    isEmail(field: any): string | never;
}