import {Controller} from '../lib/koa/controller';
import {Context} from 'koa';
import {ItemValidator} from '../lib/validation/item_validator';
const host = 'http://localhost';

const jwtPort = 9899;
const jwtSecret = 'test-secret';
const jwtPublicPath = '^\/public';

const commonPort = 9891;

const jwtConfigMock = {
    port: jwtPort,
    jwt: {
        secret: jwtSecret,
        publicPath: jwtPublicPath
    }
};

const commonConfigMock = {
    port: commonPort,
    userAgent: true,
    logLevel: 'TRACE'
};

const publicResource = '/public/test';
const publicResourceWithError = '/public/errors/common';
const publicResourceWithValidation = '/public/errors/validation';
const publicResourceWithMiddlewareValidation = '/public/errors/middleware/validation';
const publicResourceWithAgent = '/public/agent';
const protectedResource = '/test';
const nonExistingResource = '/public/abcd';

export class TestController extends Controller {
    publicResource = async(ctx: Context, next: Function): Promise<void> => {
        ctx.body = 1;
        await next();
    };

    protectedResource = async(ctx: Context, next: Function): Promise<void> => {
        ctx.body = 2;
        await next();
    };

    publicResourceWithError = async(ctx: Context, next: Function): Promise<void> => {
        throw new Error('Test error');
    };

    publicResourceWithValidation = async(ctx: Context, next: Function): Promise<void> => {
        const data = this.validate(ctx, (validator: ItemValidator) => {
            return {
                testField: validator.isEmail('testField'),
                testQueryField: validator.isInt('testQueryField')
            };
        });

        ctx.body = {
            testField: data.testField,
            testQueryField: data.testQueryField
        };
        await next();
    };

    publicResourceWithMiddlewareValidation = async(ctx: Context, next: Function): Promise<void> => {
        // TODO
        ctx.body = (ctx as any).validatedData;
        await next();
    };

    publicResourceWithAgent = async(ctx: Context, next: Function): Promise<void> => {
        ctx.body = ctx.state.userAgent;
        await next();
    }
}

const testController = new TestController();

export {host, jwtPort, jwtSecret, jwtPublicPath, commonPort, jwtConfigMock, commonConfigMock, testController,
    publicResource, publicResourceWithError, publicResourceWithValidation, publicResourceWithAgent,
    protectedResource, nonExistingResource, publicResourceWithMiddlewareValidation
}