import { IValidator } from "./interfaces";
export declare class ItemValidator implements IValidator {
    item: {};
    constructor(item: any);
    isInt(field: any): any | never;
    escape(field: string): string;
    isString(field: any): any | never;
    isEmail(field: any): string | never;
}
