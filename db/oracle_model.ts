import * as config from 'config';
import * as oracledb from 'oracledb';
import OracleService from './oracle';
import IConnectionAttributes = oracledb.IConnectionAttributes;
import IExecuteReturn = oracledb.IExecuteReturn;

const DB_CONFIG_MAP = {
    qwstat: 'oracleQwStat',
    qw: 'oracleQw',
    qdanalit: 'oracleAnalit',
};

export type TOracleDbType = 'qwstat' | 'qw' | 'qdanalit';

export const DB_TYPE_QWSTAT: TOracleDbType = 'qwstat';
export const DB_TYPE_QW: TOracleDbType = 'qw';
export const DB_TYPE_QDANALIT: TOracleDbType = 'qdanalit';

export const NO_SUCH_DB = 'NO_SUCH_DB';

export default class OracleModel {
    constructor() {

    }

    /**
     * Performs request, using passed db and sql.
     * @param {string} db
     * @param {string} sql
     * @return {Promise<IExecuteReturn>}
     */
    static async getDbData(db: TOracleDbType, sql: string): Promise<IExecuteReturn> {
        const configValue = DB_CONFIG_MAP[db];

        if (!configValue) {
            throw new Error(NO_SUCH_DB);
        }

        const connectionAttributes = config.get<IConnectionAttributes>(configValue);
        const oracle = new OracleService();

        await oracle.connect(connectionAttributes);

        const rows = await oracle.getRows(sql);
        await oracle.closeConnection();

        return rows;
    }
};