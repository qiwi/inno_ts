/**
 * PG pool wrapper for returning result columns in camelCase.
 */
import * as Pool from 'pg-pool';
import * as pg from 'pg';
import * as pgCamelCase from 'pg-camelcase';

delete require.cache[require.resolve('pg')];

pgCamelCase.inject(pg);

export class PgPool extends Pool {
    Client: any;
    constructor(options: any) {
        super(options);
        this.Client = pg.Client;
    }
}