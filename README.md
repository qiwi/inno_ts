# Overview
innots is a wrapper around [koa framework](https://www.npmjs.com/package/koa) 
and some popular koa middlewares for quick app init and bootstrap.

First of all module is designed to use with typescript and it's async await implementation
but you can also use it with plain javascript.

```
import {App, Context} from 'innots';

const app = new App({
    port: 9080
});

app.route('post', '/test', async (ctx: Context, next: () => any): Promise<void> => {
   ctx.body = 1;
   await next();
});
```

You can also define validation middleware in route method 
(validation is powered by [joi library](https://www.npmjs.com/package/joi)):

```
app.route(
    'get',
    publicResourceWithMiddlewareValidation,
    ((joi) => {
        return joi.object().keys({
            testField: joi.string().trim().email().required(),
            testQueryField: joi.number().integer()
        });
    }),
    async (ctx: Context, next: () => any): Promise<void> => {
       // you can access your data by ctx.validatedData parameter
       await next();
    })
);
```

# Usage

## App class

### new App(config: IAppConfig, router?: Router, customMiddlewares?: IAppMiddlewares)
Constructs new http server (powered by [koa framework](https://www.npmjs.com/package/koa)) with pre-defined built in router and middlewares.

#### config: IAppConfig
An object for configuring built in middlewares.

```
{
    host?: string; // listening host, e.g. 'localhost'
    port: number; // listening port
    jwt?: { // config for jwt middleware (jwt middleware is enabled if config exists)
        secret: string; // jwt secret 
        publicPath: string; // regexp for public paths (not protected by jwt)
        prefix?: string; // prefix before token in auth header (e.g JWT in "JWT <token>", or "Bearer" in "Bearer <token>")
    };
    cors?: { // CORS is enabled by default, you can edit it by providing this config param
        enabled: boolean; // enable/disable CORS
        origin: string; // Access-Control-Allow-Origin header
        credentials: string; // Access-Control-Allow-Credentials header
    };
    userAgent?: boolean; // Enable or disable userAgent processing middleware
    enableLogMiddleware?: boolean; // Enable or disable request info logging middleware
}
```

#### router?: Router
An instance of [koa-router](https://www.npmjs.com/package/koa-router) (you can use it if you don't want to use built in router)

#### customMiddlewares: IAppMiddlewares
An object with your own custom implementations if middlewares (if you don't want to use 
built in middlewares):

```
{
    bodyParser?: Middleware; // bodyParser middleware - defaults to koa-bodyparser
    log?: Middleware;
    error?: Middleware; 
    jwt?: Middleware;
    cors?: Middleware;
    userAgent?: Middleware;
    success?: Middleware;
}
```

You can see middleware implementations here: https://github.com/qiwi/inno_ts/tree/latest/src/lib/koa/middleware