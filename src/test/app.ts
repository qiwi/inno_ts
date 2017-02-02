import * as Router from 'koa-router';
import {App} from '../index';
import * as request from 'request-promise';
import {expect} from 'chai';
import * as jsonWebToken from 'jsonwebtoken';
import * as Koa from 'koa';
import Context = Koa.Context;
import {ValidationError} from "../lib/error/validation";
import {AuthError} from "../lib/error/auth";

const router = new Router();

const host = 'http://localhost';

const jwtPort = 9890;
const jwtSecret = 'test-secret';
const jwtPublicPath = '^\/public';

const commonPort = 9891;

const publicResource = '/public/test';
const publicResourceWithError = '/public/errors/common';
const publicResourceWithValidationError = '/public/errors/validation';
const protectedResource = '/test';

function makeRequestAddress(port: number, resource: string): string {
    return `${host}:${port}${resource}`;
}

const jwtConfigMock = {
    get: (key: string) => {
        switch (key) {
            case 'port':
                return jwtPort;
            case 'jwt.secret':
                return jwtSecret;
            case 'jwt.publicPath':
                return jwtPublicPath;
            default:
                return '';
        }
    },
    has: (key: string) => {
        switch (key) {
            case 'jwt.secret':
                return true;
            default:
                return '';
        }
    }
};

const commonConfigMock = {
    get: (key: string) => {
        switch (key) {
            case 'port':
                return commonPort;
            default:
                return '';
        }
    },
    has: (key: string) => {
        switch (key) {
            case 'jwt.secret':
                return false;
            default:
                return '';
        }
    }
};

router
    .post(publicResource, async function(ctx: Context, next: Function): Promise<void> {
        ctx.body = 1;
        await next();
    })
    .post(protectedResource, async function(ctx: Context, next: Function): Promise<void> {
        ctx.body = 2;
        await next();
    })
    .get(publicResourceWithError, async function(ctx: Context, next: Function): Promise<void> {
        throw new Error('Test error');
    })
    .post(publicResourceWithValidationError, async function(ctx: Context, next: Function): Promise<void> {
        throw new ValidationError(ValidationError.NO_EMAIL, 'testField', 'testValue');
    });

/* tslint:disable:typedef */
describe('app', async function(): Promise<void> {
    before(function(done: Function) {
        // TODO !!!!!! DANGER ZONE - refactor me
        const jwtApp = new App(jwtConfigMock, router);
        const app = new App(commonConfigMock, router);
        setTimeout(done, 1000);
    });

    describe('router', async function() {
        it('serves requests', async function() {
            const response = await request.post(makeRequestAddress(jwtPort, publicResource), {
                form: {},
                json: true
            });
            expect(response.result).to.eq(1);
        });

        it('returns error when accessing protected resource with no key', async function() {
            const response = await request.post(makeRequestAddress(jwtPort, protectedResource), {
                form: {},
                json: true,
                simple: false
            });
            expect(response.error).to.eq('ERROR_AUTH_TOKEN_IS_INVALID');
        });

        it('serves protected request with passed key', async function() {
            const token = jsonWebToken.sign({foo: 1}, jwtSecret);
            const response = await request.post(makeRequestAddress(jwtPort, protectedResource), {
                form: {},
                json: true,
                auth: {
                    bearer: token
                }
            });
            expect(response.result).to.eq(2);
        });

        it('makes all routes unprotected w/o jwt config', async function() {
            const response = await request.post(makeRequestAddress(commonPort, protectedResource), {
                form: {},
                json: true
            });
            expect(response.result).to.eq(2);
        });
    });

    describe('errors', async function() {
        it('should catch error and return its code', async function() {
            const response = await request.get(makeRequestAddress(commonPort, publicResourceWithError), {
                json: true,
                simple: false
            });
            expect(response.error).to.eq('ERROR_INTERNAL');
        });

        it('should return validation error', async function() {
            const response = await request.post(makeRequestAddress(commonPort, publicResourceWithValidationError), {
                json: true,
                simple: false
            });
            expect(response.error).to.eq('ERROR_VALIDATION_NO_EMAIL');
            expect(response.details).to.eql({
                invalidField: 'testField',
                invalidValue: 'testValue'
            });
        });
    });
});