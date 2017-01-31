import * as Router from 'koa-router';
import {App} from '../index';
import * as request from 'request-promise';
import {expect} from 'chai';
import * as jsonWebToken from 'jsonwebtoken';
import * as Koa from 'koa';
import Context = Koa.Context;

const router = new Router();

const host = 'http://localhost';

const jwtPort = 9888;
const jwtSecret = 'test-secret';
const jwtPublicPath = '^\/public';

const commonPort = 9889;

const publicResource = '/public/test';
const protectedResource = '/test';

function makeRequestAddress(port: number, resource: string): string {
    return `${host}:${port}${resource}`;
}

const jwtConfigMock = {
    get: function(key: string) {
        switch (key) {
            case 'port':
                return jwtPort;
            case 'jwt.secret':
                return jwtSecret;
            case 'jwt.publicPath':
                return jwtPublicPath;
        }
    },
    has: function(key: string) {
        switch (key) {
            case 'jwt.secret':
                return true;
        }
    }
};

const commonConfigMock = {
    get: function(key: string) {
        switch (key) {
            case 'port':
                return commonPort
        }
    },
    has: function(key: string) {
        switch (key) {
            case 'jwt.secret':
                return false;
        }
    }
};

router
    .post(publicResource, function(ctx: Context, next: Function) {
        ctx.body = 1;
        next();
    })
    .post(protectedResource, function(ctx: Context, next: Function) {
        ctx.body = 2;
        next();
    });

describe('koa', async function () {
    before(function(done) {
        // TODO !!!!!! DANGER ZONE - refactor me
        const jwtApp = new App(jwtConfigMock, router);
        const app = new App(commonConfigMock, router);
        setTimeout(done, 1000);
    });

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