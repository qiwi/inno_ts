import * as Koa from "koa";
import * as jwt from "koa-jwt";
import * as bodyParser from 'koa-bodyparser';
import {errorMiddleware} from './error_middleware';
import {successMiddleware} from './success_middleware';
import * as Router from 'koa-router';
import * as config from 'config';
import IConfig = config.IConfig;
import * as koaCors from 'koa-cors';
import * as userAgent from 'koa-useragent';
import {logMiddleware} from "./log_middleware";

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

        if (config.has('logLevel') && (config.get<string>('logLevel') === 'TRACE' || config.get<string>('logLevel') === 'DEBUG')) {
            app.use(logMiddleware);
        }

        app.use(errorMiddleware);

        // Enabling JWT middleware
        if (jwtSecret) {
            app.use(jwt({secret: jwtSecret})
                .unless({
                    path: [
                        new RegExp(config.get<string>('jwt.publicPath'))
                    ],
                    method: 'OPTIONS'
                }));
        }

        // CORS middleware (enabled by default)
        if (!config.has('cors.enabled') || config.get<boolean>('cors.enabled') !== false) {
            const corsConfig: any = {
                origin: '*'
            };

            if (config.has('cors.origin')) {
                corsConfig.origin = config.get<string>('cors.origin');
            }

            if (config.has('cors.credentials')) {
                corsConfig.credentials = config.get<boolean>('cors.credentials');
            }

            app.use(koaCors(corsConfig));
        }

        // User-Agent middleware
        if (config.has('userAgent') && config.get<boolean>('userAgent') === true) {
            app.use(userAgent());
        }

        app.use(router.routes());
        app.use(router.allowedMethods());
        app.use(successMiddleware);

        app.on('error', (err, ctx) => console.error('REQUEST_ERROR', err, ctx));
        process.on('uncaughtException', (err) => console.error('PROCESS_EXCEPTION', err.stack));

        app.listen(appPort, () => console.info('Server listening on port ' + appPort));
        this.koa = app;
    }
}