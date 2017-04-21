import * as oracledb from 'oracledb';
import IConnection = oracledb.IConnection;
import IExecuteReturn = oracledb.IExecuteReturn;
import IExecuteOptions = oracledb.IExecuteOptions;
import IResultSet = oracledb.IResultSet;
import IConnectionAttributes = oracledb.IConnectionAttributes;
import {BaseError} from "../error/base";
import {IConnectionPool} from "oracledb";

export const DB_CONNECT_ERROR: string = 'DB_QUERY';
export const DB_ORACLE_ERROR: string = 'DB_ORACLE_ERROR';
export const DB_ORACLE_FETCH_ERROR: string = 'DB_ORACLE_FETCH_ERROR';
export const DB_ORACLE_CLOSE_ERROR: string = 'DB_ORACLE_CLOSE_ERROR';
export const DB_ORACLE_RELEASE_ERROR: string = 'DB_ORACLE_RELEASE_ERROR';

// TODO DbError

export class OracleService {
    public poolMax: number = 50;

    protected connectionParams: IConnectionAttributes;
    protected pool: IConnectionPool;

    constructor(connectionParams: IConnectionAttributes) {
        this.connectionParams = connectionParams;
    }

    /**
     * Curried {@link getRows} method: getRows with rows prefetch param.
     * @param query
     * @param params
     * @return {Promise<IExecuteReturn>}
     */
    async getManyRows(query: string, params: Array<any> = []): Promise<IExecuteReturn> {
        try {
            return await this._execute(query, params, {resultSet: true, prefetchRows: 500});
        } catch (error) {
            throw new BaseError({
                code: DB_ORACLE_ERROR,
                innerDetails: {
                    query,
                    message: error.message,
                    params
                }
            });
        }
    };

    /**
     * Fetches rows from result set.
     * @param resultSet
     * @param numRows
     * @return {Promise<Array<any>[]>}
     */
    async fetchRows(resultSet: IResultSet, numRows: number): Promise<Array<any>[]> {
        let rows;
        try {
            rows = await resultSet.getRows(numRows);
        } catch (error) {
            await this.closeResultSet(resultSet);
            throw new BaseError({
                code: DB_ORACLE_FETCH_ERROR,
                innerDetails: error.message
            });
        }

        if (rows.length === 0) {    // no rows, or no more rows
            await this.closeResultSet(resultSet); // always close the result set
            return [];
        }

        return rows;
    };

    /**
     * Closes result set (optional - closes db connection).
     * @param resultSet
     * @param connection
     * @return {Promise<void>}
     */
    async closeResultSet(resultSet: IResultSet, connection?: IConnection): Promise<void> {
        try {
            await resultSet.close();
        } catch (error) {
            throw new BaseError({
                code: DB_ORACLE_FETCH_ERROR,
                innerDetails: error.message
            });
        }

        if (connection) {
            await this.disconnect(connection);
        }
    };

    /**
     * Executes sql and returns rows from executed result.
     * @param query
     * @param params
     * @param options
     * @return {Promise<Array<any>>}
     */
    async getRows(query: string, params: Array<any> = [], options: IExecuteOptions = {}): Promise<Array<any>> {
        try {
            const result: IExecuteReturn = await this._execute(query, params, options);

            return result.rows;
        } catch (error) {
            throw new BaseError({
                code: DB_ORACLE_ERROR,
                innerDetails: {
                    query,
                    message: error.message,
                    params
                }
            });
        }
    };

    /**
     * Performs connection to database using passed connection params.
     * @return {Promise<void>}
     */
    protected async connect(): Promise<IConnection> {
        try {
            if (!this.pool) {
                this.pool = await oracledb.createPool(
                    Object.assign({}, this.connectionParams, {poolMax: this.poolMax})
                );
            }
            return await this.pool.getConnection();
        } catch (error) {
            throw new BaseError({
                code: DB_CONNECT_ERROR,
                innerDetails: error.message
            });
        }
    };

    /**
     * Closes db conn.
     * @return {Promise<void>}
     */
    protected async disconnect(connection: IConnection): Promise<void> {
        try {
            await connection.close();
        } catch (error) {
            throw new BaseError({
                code: DB_ORACLE_RELEASE_ERROR,
                innerDetails: error.message
            });
        }
    };

    protected async _execute(query: string,
                             params?: Object | Array<any>,
                             options?: IExecuteOptions): Promise<IExecuteReturn> {
        let connection;
        try {
            connection = await this.connect();
            const result = await connection.execute(query, params, options);
            await this.disconnect(connection);

            return result;
        } catch (error) {
            if (connection) {
                await this.disconnect(connection);
            }

            throw error;
        }
    }
}