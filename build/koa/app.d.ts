/// <reference types="koa" />
/// <reference types="koa-bodyparser" />
/// <reference types="koa-router" />
import * as Koa from "koa";
import * as Router from 'koa-router';
export declare class App {
    koa: Koa;
    constructor(config: any, router: Router);
    private initKoa(config, router);
}
