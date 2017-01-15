"use strict";
const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const error_middleware_1 = require("./error_middleware");
class App {
    constructor(config, router) {
        this.initKoa(config, router);
    }
    initKoa(config, router) {
        const app = new Koa();
        const appPort = config.get('port');
        app.use(bodyParser());
        app.use(error_middleware_1.errorMiddleware);
        app.use(router.routes());
        app.use(router.allowedMethods());
        app.on('error', (err, ctx) => console.log('REQUEST_ERROR', err, ctx));
        process.on('uncaughtException', (err) => console.log('PROCESS_EXCEPTION', err.stack));
        app.listen(appPort, () => console.log('Server listening on port ' + appPort));
        this.koa = app;
    }
}
exports.App = App;
