/// <reference types="oracledb" />
import * as oracledb from 'oracledb';
import IExecuteReturn = oracledb.IExecuteReturn;
import IExecuteOptions = oracledb.IExecuteOptions;
import IResultSet = oracledb.IResultSet;
import IConnectionAttributes = oracledb.IConnectionAttributes;
export declare const DB_CONNECT_ERROR: string;
export declare const DB_ORACLE_ERROR: string;
export declare const DB_ORACLE_FETCH_ERROR: string;
export declare const DB_ORACLE_CLOSE_ERROR: string;
export declare const DB_ORACLE_RELEASE_ERROR: string;
declare module 'oracledb' {
    interface IResultSet {
        getRows(num: number): any;
    }
}
export default class OracleService {
    private connectionParams;
    private connection;
    constructor(connectionParams: IConnectionAttributes);
    connect(): Promise<void> | never;
    disconnect(): Promise<void>;
    getManyRows(query: string, params?: Array<any>): Promise<IExecuteReturn> | never;
    fetchRows(resultSet: IResultSet, numRows: any): Promise<Array<any>[]> | never;
    closeResultSet(resultSet: IResultSet, closeConnection?: boolean): Promise<void> | never;
    getRows(sql: string, bindParams?: Array<any>, options?: IExecuteOptions): Promise<{}[]> | never;
}