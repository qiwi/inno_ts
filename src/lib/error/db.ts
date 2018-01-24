export interface IDbErrorOptions {
    code?: string;
    innerDetails?: object;
    publicMessage?: string;
    status?: number;
}

export class DbError extends Error {
    public static readonly CODE_DEFAULT: string = 'DB_ERROR';
    public static readonly STATUS_DEFAULT: number = 500;
    public static readonly MESSAGE_DEFAULT: string = 'Db query failed';

    public code: string;
    public status: number;

    protected innerDetails: object;

    constructor(data: IDbErrorOptions) {
        super(data.publicMessage || DbError.MESSAGE_DEFAULT);

        this.code = data.code || DbError.CODE_DEFAULT;
        this.status = data.status || DbError.STATUS_DEFAULT;
        this.innerDetails = data.innerDetails;
    }
}