import * as Koa from "koa";
import * as jwt from "koa-jwt";
import * as bodyParser from 'koa-bodyparser';
import {errorMiddleware} from './error_middleware';
import {successMiddleware} from './success_middleware';
import * as Router from 'koa-router';
import * as config from 'config';
import IConfig = config.IConfig;
import * as koaCors from 'koa-cors';

export class App {
    koa: Koa;

    constructor(config: IConfig | any, router: Router) {
        this.initKoa(config, router);
    }

    private initKoa(config: IConfig, router: Router): void {
        const app = new Koa();
        const appPort = config.get('port');
        let jwtSecret = config.has('jwt.secret') ? config.get('jwt.secret') : null;

        app.use(bodyParser());
        app.use(errorMiddleware);
        if (jwtSecret) {
            app.use(jwt({secret: jwtSecret})
                .unless({
                    path: [
                        new RegExp(config.get<string>('jwt.publicPath'))
                    ]
                }));
        }
        if (!config.has('cors') || config.get<boolean>('cors') !== false) {
            app.use(koaCors({origin: '*'}));
        }
        app.use(router.routes());
        app.use(router.allowedMethods());
        app.use(successMiddleware);

        app.on('error', (err, ctx) => console.log('REQUEST_ERROR', err, ctx));
        process.on('uncaughtException', (err) => console.log('PROCESS_EXCEPTION', err.stack));

        app.listen(appPort, () => console.log('Server listening on port ' + appPort));
        this.koa = app;
    }
}