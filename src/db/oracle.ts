import * as oracledb from 'oracledb';
import IConnection = oracledb.IConnection;
import IExecuteReturn = oracledb.IExecuteReturn;
import IExecuteOptions = oracledb.IExecuteOptions;
import IResultSet = oracledb.IResultSet;
import IConnectionAttributes = oracledb.IConnectionAttributes;
import {ResultError} from "../error";

export const DB_CONNECT_ERROR: string = 'DB_QUERY';
export const DB_ORACLE_ERROR: string = 'DB_ORACLE_ERROR';
export const DB_ORACLE_FETCH_ERROR: string = 'DB_ORACLE_FETCH_ERROR';
export const DB_ORACLE_CLOSE_ERROR: string = 'DB_ORACLE_CLOSE_ERROR';
export const DB_ORACLE_RELEASE_ERROR: string = 'DB_ORACLE_RELEASE_ERROR';

export default class OracleService {
    private connectionParams: IConnectionAttributes;
    private connection: IConnection;

    constructor(connectionParams: IConnectionAttributes) {
        this.connectionParams = connectionParams;
    }

    /**
     * Performs connection to database using passed connection params.
     * @return {Promise<void>}
     */
    public async connect(): Promise<void> | never {
        try {
            this.connection = await oracledb.getConnection(this.connectionParams);
            console.log((new Date()).toString() + ' Oracle connected');
        } catch (error) {
            throw new ResultError(DB_CONNECT_ERROR, 500, error.message);
        }
    };

    /**
     * Closes db conn.
     * @return {Promise<void>}
     */
    public async disconnect(): Promise<void> {
        try {
            await this.connection.release();
        } catch (error) {
            throw new ResultError(DB_ORACLE_RELEASE_ERROR, 500, error.message);
        }
    };

    /**
     * Curried {@link getRows} method: getRows with rows prefetch param.
     * @param query
     * @param params
     * @return {Promise<IExecuteReturn>}
     */
    async getManyRows(query: string, params: Array<any> = []): Promise<IExecuteReturn> | never {
        try {
            return await this.connection.execute(query, params, {resultSet: true, prefetchRows: 500});
        } catch (error) {
            throw new ResultError(DB_ORACLE_ERROR, 500, query + '\n' + error.message + '\n' + params.toString());
        }
    };

    /**
     * Fetches rows from result set.
     * @param resultSet
     * @param numRows
     * @return {Promise<Array<any>[]>}
     */
    async fetchRows(resultSet: IResultSet, numRows): Promise<Array<any>[]> | never {
        let rows;
        try {
            rows = await resultSet.getRows(numRows);
        } catch (error) {
            await this.closeResultSet(resultSet);
            throw new ResultError(DB_ORACLE_FETCH_ERROR, 500, error.message);
        }

        if (rows.length == 0) {    // no rows, or no more rows
            await this.closeResultSet(resultSet); // always close the result set
            return [];
        }

        return rows;
    };

    /**
     * Closes result set (optional - closes db connection).
     * @param resultSet
     * @param closeConnection
     * @return {Promise<void>}
     */
    async closeResultSet(resultSet: IResultSet, closeConnection: boolean = false): Promise<void> | never {
        try {
            await resultSet.close();
        } catch (error) {
            throw new ResultError(DB_ORACLE_CLOSE_ERROR, 500, error.message);
        }

        if (closeConnection) {
            await this.disconnect();
        }
    };

    /**
     * Executes sql and returns rows from executed result.
     * @param sql
     * @param bindParams
     * @param options
     * @return {Promise<Array<any>>}
     */
    async getRows(sql: string, bindParams: Array<any> = [], options: IExecuteOptions = {}): Promise<{}[]> | never {
        try {
            const result: IExecuteReturn = await this.connection.execute(sql, bindParams, options);

            return result.rows;
        } catch (error) {
            throw new ResultError(DB_ORACLE_ERROR, 500, sql + '\n' + error.message + '\n' + bindParams.toString());
        }
    };
};