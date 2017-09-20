export const ONE_ROW_WARNING = 'WARNING_DB_GET_ROW. Expected 1 row. Got %j %s';

export interface IDbService {
    run(...args: any[]): Promise<any>;
    mustGetRow(...args: any[]): Promise<any>;
    getRows(...args: any[]): Promise<any>;
    getRow(...args: any[]): Promise<any>;
}