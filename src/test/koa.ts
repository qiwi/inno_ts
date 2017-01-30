import * as Router from 'koa-router';
import {App} from '../index';
import * as request from 'request-promise';
import {expect} from 'chai';

const router = new Router();

const port = 9888;

const configMock = {
    get: function(key: string) {
        switch (key) {
            case 'port':
                return port;
        }
    }
};

router
    .post('/test/', function(ctx) {
        ctx.body = {result: 1};
    });

describe('koa', async function () {

    before(function(done) {
        // TODO !!!!!! DANGER ZONE - refactor me
        const app = new App(configMock, router);
        setTimeout(done, 1000);
    });

    it('serves requests', async function() {
        const response = await request.post(`http://localhost:${port}/test`, {
            form: {},
            json: true
        });
        expect(response.result).to.eq(1);
    });
});