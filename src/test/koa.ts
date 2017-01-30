import * as Router from 'koa-router';
import {App} from '../index';
import * as request from 'request-promise';
import {expect} from 'chai';
import * as jsonWebToken from 'jsonwebtoken';

const router = new Router();

const port = 9888;
const publicResource = '/public/test';
const protectedResource = '/test';
const secret = 'test-secret';

const configMock = {
    get: function(key: string) {
        switch (key) {
            case 'port':
                return port;
            case 'secret':
                return secret;
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
        const app = new App(configMock, router);
        setTimeout(done, 1000);
    });

    it('serves requests', async function() {
        const response = await request.post(`http://localhost:${port}${publicResource}`, {
            form: {},
            json: true
        });
        expect(response.result).to.eq(1);
    });

    it('returns error when accessing protected resource with no key', async function() {
        const response = await request.post(`http://localhost:${port}${protectedResource}`, {
            form: {},
            json: true,
            simple: false
        });
        console.log('response is', response);
        expect(response.error).to.eq('ERROR_AUTH_TOKEN_IS_INVALID');
    });

    it('serves protected request with passed key', async function() {
        const token = jsonWebToken.sign({foo: 1}, secret);
        const response = await request.post(`http://localhost:${port}${protectedResource}`, {
            form: {},
            json: true,
            auth: {
                bearer: token
            }
        });
        expect(response.result).to.eq(2);
    });
});