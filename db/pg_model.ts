import {PgService} from './pg';

export default class PgModel {
    pg: PgService;

    constructor(pg: PgService) {
        this.pg = pg;
    }
}