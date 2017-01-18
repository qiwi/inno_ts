// Extended oracledb type definition

import * as stream from 'stream';
import * as events from 'events';

declare module 'oracledb' {
    interface IResultSet {
        getRows(num: number): Promise<any>;
    }
}
