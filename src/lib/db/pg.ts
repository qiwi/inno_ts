import {BaseError} from '../error/base';
import * as pgPool from 'pg-pool';
import Pool = pgPool.Pool;
import {QueryResult} from "pg";
import {ONE_ROW_WARNING} from "./db_service";

export const DB_QUERY = 'DB_QUERY';
export const NO_ROW_ERROR = 'DB_NO_SUCH_';

export class PgService {
    protected pool: Pool;

    constructor(pgPool: Pool) {
        this.pool = pgPool;
    }

    /**
     * Executes query (public wrapper).
     * @param query
     * @param params
     * @return {Promise<void>}
     */
    async run(query: string, params?: Array<any>): Promise<QueryResult> {
        return await this._run(query, params);
    }

    /**
     * Executes query and returns result rows.
     * @param query
     * @param params
     * @return {Promise<Array<any>>}
     */
    async getRows(query: string, params?: Array<any>): Promise<Array<any>> {
        const items = await this._run(query, params);
        return items.rows;
    }

    /**
     * Executes query and returns result row.
     * @param query
     * @param params
     * @return {Promise<Array<any>>}
     */
    async getRow(query: string, params?: Array<any>): Promise<any> {
        const items = await this._run(query, params);
        const rows = items.rows || [];
        if (rows.length === 0) {
            return false;
        }

        if (rows.length > 1) {
            console.warn(ONE_ROW_WARNING, rows.length, query);
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
    async mustGetRow(errorCode: string, query: string, params?: Array<any>): Promise<any> {
        const row = await this.getRow(query, params);
        if (row === false) {
            throw new BaseError({
                code: errorCode,
                innerDetails: {}
            });
        }
        return row;
    }

    /**
     * Executes query.
     * @param query
     * @param params
     * @return {Promise<QueryResult>}
     * @private
     */
    private async _run(query: string, params: Array<any> = []): Promise<QueryResult> {
        try {
            return await this.pool.query(query, params);
        } catch (err) {
            throw new BaseError({
                code: DB_QUERY,
                innerDetails: err
            });
        }
    }
}
