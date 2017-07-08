import * as Koa from "koa";
import * as bodyParser from 'koa-body';
import {errorMiddleware} from './middleware/error_middleware';
import {successMiddleware} from './middleware/success_middleware';
import * as Router from 'koa-router';
import * as koaCors from 'koa-cors';
import * as userAgent from 'koa-useragent';
import {logMiddleware} from "./middleware/log_middleware";
import {createJwtMiddleware} from './middleware/jwt_middleware';
import * as _ from 'lodash';

/**
 * Main class for koa startup.
 */
export class App {
    protected koaAppInstance: Koa;

    constructor(
        protected config: any,
        protected router: Router
    ) {}

    /**
     * Inits koa app with default preset middlewares:
     * body parser, log middleware, error, jwt, cors, user agent etc.
     *
     * @return {Promise<void>}
     */
    public async bootstrap(): Promise<void> {
        this.koaAppInstance = new Koa();

        this._enableBodyParser();
        this._enableLogMiddleware();
        this._enableErrorMiddleware();
        this._enableJwtMiddleware();
        this._enableCorsMiddleware();
        this._enableUserAgentMiddleware();

        this.koaAppInstance.use(this.router.routes());
        this.koaAppInstance.use(this.router.allowedMethods());

        this._enableSuccessMiddleware();

        this.koaAppInstance.on('error', this._processError);

        process.on('uncaughtException', this._processUncaughtException);

        await this._startApp();
    }

    protected _enableBodyParser(multipart: boolean = true): void {
        this.koaAppInstance.use(bodyParser({multipart}));
    }

    protected _enableLogMiddleware(): void {
        if (this.config.logLevel
            && this.config.logLevel === 'TRACE'
            || this.config.logLevel === 'DEBUG'
        ) {
            this.koaAppInstance.use(logMiddleware);
        }
    }

    protected _enableErrorMiddleware(): void {
        this.koaAppInstance.use(errorMiddleware);
    }

    protected _enableJwtMiddleware(): void {
        let jwtSecret = _.get(this.config, 'jwt.secret');
        if (jwtSecret) {
            const jwtPrefix = this.config.jwt.prefix;

            this.koaAppInstance.use(createJwtMiddleware(
                jwtSecret as string, this.config.jwt.publicPath as string, jwtPrefix)
            );
        }
    }

    protected _enableCorsMiddleware(): void {
        const enabled = _.get(this.config, 'cors.enabled');
        if (typeof enabled === 'undefined' || enabled !== false) {
            const corsConfig: any = {
                origin: '*'
            };

            const origin = _.get(this.config, 'cors.origin');
            if (origin) {
                corsConfig.origin = origin;
            }

            const credentials = _.get(this.config, 'cors.credentials');
            if (credentials) {
                corsConfig.credentials = credentials;
            }

            this.koaAppInstance.use(koaCors(corsConfig));
        }
    }

    protected _enableUserAgentMiddleware(): void {
        if (this.config.userAgent) {
            this.koaAppInstance.use(userAgent());
        }
    }

    protected _enableSuccessMiddleware(): void {
        this.koaAppInstance.use(successMiddleware);
    }

    protected _processError(err: any, ctx: Koa.Context): void {
        console.error('REQUEST_ERROR', err, ctx);
    }

    protected _processUncaughtException(err: any): void {
        console.error('PROCESS_EXCEPTION', err.stack);
    }

    private async _startApp(): Promise<void> {
        const host = this.config.host;
        const port = this.config.port;
        if (host) {
            this.koaAppInstance.listen(port, host, async () => {
                console.info(
                    `Server listening on port ${port} and host ${host}`
                );
                return Promise.resolve();
            });
        } else {
            this.koaAppInstance.listen(port, host, async () => {
                console.info('Server listening on port ' + port);
                return Promise.resolve();
            });
        }
    }
}