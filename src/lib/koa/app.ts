import * as Koa from "koa";
import * as Router from 'koa-router';
import * as _ from 'lodash';
import {IAppConfig, IAppMiddlewares} from './interfaces';
import {createDefaultMiddlewareCollection} from './middleware/collection';
import {IMiddleware} from 'koa-router';
import * as joi from 'joi';
import {createValidationMiddleware, customJoi} from './middleware/validation_middleware';

export type TJoiSchemaGenerator = (joiObject: any) => joi.ObjectSchema;

/**
 * Main class for koa startup.
 */
export class InnotsApp {
    protected koaAppInstance: Koa;
    protected middlewares: IAppMiddlewares;

    constructor(
        protected config: IAppConfig,
        protected router: Router = new Router(),
        customMiddlewares?: IAppMiddlewares
    ) {
        this.middlewares = Object.assign({}, createDefaultMiddlewareCollection(this.config), customMiddlewares);
    }

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
        this._enableCorsMiddleware();
        this._enableJwtMiddleware();
        this._enableUserAgentMiddleware();

        this.koaAppInstance.use(this.router.routes());
        this.koaAppInstance.use(this.router.allowedMethods());

        this._enableSuccessMiddleware();

        this.koaAppInstance.on('error', this._processError);

        process.on('uncaughtException', this._processUncaughtException);

        await this._startApp();
    }

    public route(method: string, url: string, ...args: any[]): void {
        args.forEach((arg, index) => {
            if (arg.length === 1) { // check for joiSchemaGenerator
                const validationSchema = arg.call(this, customJoi);
                args[index] = this._createValidationMiddleware(validationSchema);
            }
        });

        this.router[method].apply(this.router, ([url] as any).concat(args));
    }

    protected _enableBodyParser(): void {
        this.koaAppInstance.use(this.middlewares.bodyParser);
    }

    protected _enableLogMiddleware(): void {
        if (this.config.enableLogMiddleware) {
            this.koaAppInstance.use(this.middlewares.log);
        }
    }

    protected _enableErrorMiddleware(): void {
        this.koaAppInstance.use(this.middlewares.error);
    }

    protected _enableJwtMiddleware(): void {
        const jwtSecret = _.get(this.config, 'jwt.secret');
        if (jwtSecret) {
            this.koaAppInstance.use(this.middlewares.jwt);
        }
    }

    protected _enableCorsMiddleware(): void {
        const enabled = _.get(this.config, 'cors.enabled');
        if (typeof enabled === 'undefined' || enabled !== false) {
            this.koaAppInstance.use(this.middlewares.cors);
        }
    }

    protected _enableUserAgentMiddleware(): void {
        if (this.config.userAgent) {
            this.koaAppInstance.use(this.middlewares.userAgent);
        }
    }

    protected _enableSuccessMiddleware(): void {
        this.koaAppInstance.use(this.middlewares.success);
    }

    protected _createValidationMiddleware(schema: joi.ObjectSchema): IMiddleware {
        return createValidationMiddleware(schema);
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
        let promise;
        if (host) {
            promise = new Promise((resolve, reject) => {
                this.koaAppInstance.listen(port, host, () => {
                    resolve();
                });
            });
        } else {
            promise = new Promise((resolve, reject) => {
                this.koaAppInstance.listen(port, () => {
                    resolve();
                });
            });
        }

        return promise;
    }
}