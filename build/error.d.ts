export declare const ERROR_PREFIX = "ERROR_";
export interface IResultError {
    log(): void;
    code: string;
    status: number;
    logObject: any;
}
export declare class ResultError implements IResultError {
    static isError(obj: any): obj is IResultError;
    code: string;
    status: number;
    logObject: any;
    constructor(code: string, httpStatus?: number, internalLogObject?: any);
    log(): void;
}
