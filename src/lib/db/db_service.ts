export const ONE_ROW_WARNING = 'WARNING_DB_GET_ROW. Expected 1 row. Got %j %s';

export interface DbService {
    mustGetRow: Function;
    getRows: Function;
    getRow: Function;
}