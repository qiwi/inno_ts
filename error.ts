export const ERROR_PREFIX = 'ERROR_';

export class ResultError {
    public static isError(value: any): boolean {
        return value instanceof ResultError;
    }

    public code: string;
    public status: number;
    public logObject: any;

    constructor(code: string, httpStatus?: number, internalLogObject?: any) {
        this.code = ERROR_PREFIX + code;
        this.status = httpStatus || 400;
        this.logObject = internalLogObject || {};
    }

    public log(): void {
        console.error((
                new Date()).toISOString() +
            this.code + ": " +  this.status + "\ndata: ",
            this.logObject
        );
    }
}