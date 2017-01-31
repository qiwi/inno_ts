import {InnoError} from '../error/error';
import * as pgPool from 'pg-pool';
import Pool = pgPool.Pool;
import {QueryResult} from "pg";

export const DB_QUERY = 'DB_QUERY';
export const ONE_ROW_WARNING = 'WARNING_DB_GET_ROW. Expected 1 row. Got %j %s';
export const NO_ROW_ERROR = 'DB_NO_SUCH_';

export class PgService {
    pool: Pool;

    constructor(pgPool: Pool) {
        this.pool = pgPool;
    };

    /**
     * Executes query.
     * @param query
     * @param params
     * @return {Promise<QueryResult>}
     * @private
     */
    private async __run(query: string, params: Array<any> = []): Promise<QueryResult> {
        try {
            return await this.pool.query(query, params);
        } catch (err) {
            throw new InnoError(DB_QUERY, query);
        }
    }

    /**
     * Executes query (public wrapper).
     * @param query
     * @param params
     * @return {Promise<QueryResult>}
     */
    public async run(query: string, params?: Array<any>): Promise<QueryResult> {
        return await this.__run(query, params);
    }

    /**
     * Executes query and returns result rows.
     * @param query
     * @param params
     * @return {Promise<Array<any>>}
     */
    public async getRows(query: string, params?: Array<any>): Promise<Array<any>> {
        let items = await this.__run(query, params);
        return items.rows;
    }

    /**
     * Executes query and returns result row.
     * @param query
     * @param params
     * @return {Promise<Array<any>>}
     */
    public async getRow(query: string, params?: Array<any>): Promise<any> {
        const items = await this.__run(query, params);
        const rows = items.rows || [];
        if (rows.length == 0) {
            return false;
        }

        if (rows.length > 1) {
            console.log(ONE_ROW_WARNING, rows.length, query);
        }

        return rows[0];
    }

    /**
     * Wrapper around {@link getRow} - throws exception if no row fetched.
     * @param errorCode Error code in thrown error.
     * @param query
     * @param params
     * @return {Promise<any>}
     */
    public async mustGetRow(errorCode: number, query: string, params?: Array<any>): Promise<any> {
        const row = await this.getRow(query, params);
        if (row === false) {
            throw new InnoError(NO_ROW_ERROR, {}, errorCode);
        }
        return row;
    }
}
