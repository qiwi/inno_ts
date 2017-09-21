import * as koa from "koa";

/* tslint:disable */
declare module "koa" {
    interface Context {
        validatedData: {
            originalCase: any;
            camelCase: any;
        };
    }
}
