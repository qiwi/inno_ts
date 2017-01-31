import * as Router from 'koa-router';
import {App} from '../index';
import * as request from 'request-promise';
import {expect} from 'chai';
import * as jsonWebToken from 'jsonwebtoken';

const router = new Router();

const jwtPort = 9888;
const jwtSecret = 'test-secret';
const jwtPublicPath = '^\/public';

const commonPort = 9889;

const publicResource = '/public/test';
const protectedResource = '/test';


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
    .post(publicResource, function(ctx) {
        ctx.body = {result: 1};
    })
    .post(protectedResource, function(ctx) {
        ctx.body = {result: 2};
    });

describe('koa', async function () {
    before(function(done) {
        // TODO !!!!!! DANGER ZONE - refactor me
        const jwtApp = new App(jwtConfigMock, router);
        const app = new App(commonConfigMock, router);
        setTimeout(done, 1000);
    });

    it('serves requests', async function() {
        const response = await request.post(`http://localhost:${jwtPort}${publicResource}`, {
            form: {},
            json: true
        });
        expect(response.result).to.eq(1);
    });

    it('returns error when accessing protected resource with no key', async function() {
        const response = await request.post(`http://localhost:${jwtPort}${protectedResource}`, {
            form: {},
            json: true,
            simple: false
        });
        expect(response.error).to.eq('ERROR_AUTH_TOKEN_IS_INVALID');
    });

    it('serves protected request with passed key', async function() {
        const token = jsonWebToken.sign({foo: 1}, jwtSecret);
        const response = await request.post(`http://localhost:${jwtPort}${protectedResource}`, {
            form: {},
            json: true,
            auth: {
                bearer: token
            }
        });
        expect(response.result).to.eq(2);
    });

    it('makes all routes unprotected w/o jwt config', async function() {
        const response = await request.post(`http://localhost:${commonPort}${protectedResource}`, {
            form: {},
            json: true
        });
        expect(response.result).to.eq(2);
    });
});