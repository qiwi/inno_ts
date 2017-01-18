import * as pgPool from 'pg-pool';
import Pool = pgPool.Pool;
import { QueryResult } from "pg";
export declare const DB_QUERY = "DB_QUERY";
export declare const ONE_ROW_WARNING = "WARNING_DB_GET_ROW. Expected 1 row. Got %j %s";
export declare const NO_ROW_ERROR = "DB_NO_SUCH_";
export declare class PgService {
    pool: Pool;
    constructor(pgPool: Pool);
    private __run(query, params?);
    run(query: string, params?: Array<any>): Promise<QueryResult>;
    getRows(query: string, params?: Array<any>): Promise<Array<any>>;
    getRow(query: string, params?: Array<any>): Promise<any>;
    mustGetRow(errorCode: number, query: string, params?: Array<any>): Promise<any>;
}
