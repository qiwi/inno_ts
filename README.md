# Overview
innots is a wrapper around koa framework and some popular koa middlewares for 
quick app init and bootstrap.

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