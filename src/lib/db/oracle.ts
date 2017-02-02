import * as oracledb from 'oracledb';
import IConnection = oracledb.IConnection;
import IExecuteReturn = oracledb.IExecuteReturn;
import IExecuteOptions = oracledb.IExecuteOptions;
import IResultSet = oracledb.IResultSet;
import IConnectionAttributes = oracledb.IConnectionAttributes;
import {InnoError} from "../error/error";

export const DB_CONNECT_ERROR: string = 'DB_QUERY';
export const DB_ORACLE_ERROR: string = 'DB_ORACLE_ERROR';
export const DB_ORACLE_FETCH_ERROR: string = 'DB_ORACLE_FETCH_ERROR';
export const DB_ORACLE_CLOSE_ERROR: string = 'DB_ORACLE_CLOSE_ERROR';
export const DB_ORACLE_RELEASE_ERROR: string = 'DB_ORACLE_RELEASE_ERROR';

// TODO DbError

export class OracleService {
    protected connectionParams: IConnectionAttributes;
    protected connection: IConnection;

    constructor(connectionParams: IConnectionAttributes) {
        this.connectionParams = connectionParams;
    }

    /**
     * Performs connection to database using passed connection params.
     * @return {Promise<void>}
     */
    async connect(): Promise<void> {
        try {
            this.connection = await oracledb.getConnection(this.connectionParams);
            console.log((new Date()).toString() + ' Oracle connected');
        } catch (error) {
            throw new InnoError({
                code: DB_CONNECT_ERROR,
                innerDetails: error.message
            });
        }
    };

    /**
     * Closes db conn.
     * @return {Promise<void>}
     */
    async disconnect(): Promise<void> {
        try {
            await this.connection.release();
        } catch (error) {
            throw new InnoError({
                code: DB_ORACLE_RELEASE_ERROR,
                innerDetails: error.message
            });
        }
    };

    /**
     * Curried {@link getRows} method: getRows with rows prefetch param.
     * @param query
     * @param params
     * @return {Promise<IExecuteReturn>}
     */
    async getManyRows(query: string, params: Array<any> = []): Promise<IExecuteReturn> {
        try {
            return await this.connection.execute(query, params, {resultSet: true, prefetchRows: 500});
        } catch (error) {
            throw new InnoError({
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
            throw new InnoError({
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
     * @param closeConnection
     * @return {Promise<void>}
     */
    async closeResultSet(resultSet: IResultSet, closeConnection: boolean = false): Promise<void> {
        try {
            await resultSet.close();
        } catch (error) {
            throw new InnoError({
                code: DB_ORACLE_FETCH_ERROR,
                innerDetails: error.message
            });
        }

        if (closeConnection) {
            await this.disconnect();
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
            const result: IExecuteReturn = await this.connection.execute(query, params, options);

            return result.rows;
        } catch (error) {
            throw new InnoError({
                code: DB_ORACLE_ERROR,
                innerDetails: {
                    query,
                    message: error.message,
                    params
                }
            });
        }
    };
}