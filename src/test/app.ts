import * as Router from 'koa-router';
import {App} from '../index';
import * as request from 'request-promise';
import {expect} from 'chai';
import * as jsonWebToken from 'jsonwebtoken';
import * as Koa from 'koa';
import Context = Koa.Context;
import {ValidationError} from "../lib/error/validation";
import {AuthError} from "../lib/error/auth";
import {Controller} from "../lib/koa/controller";
import {InnoError} from "../lib/error/inno";
import {ItemValidator} from "../lib/validation/item_validator";

const router = new Router();

const host = 'http://localhost';

const jwtPort = 9890;
const jwtSecret = 'test-secret';
const jwtPublicPath = '^\/public';

const commonPort = 9891;

const publicResource = '/public/test';
const publicResourceWithError = '/public/errors/common';
const publicResourceWithValidation = '/public/errors/validation';
const publicResourceWithAgent = '/public/agent';
const protectedResource = '/test';
const nonExistingResource = '/public/abcd';

const validationErrorPrefix = new ValidationError().errorPrefix;
const authErrorPrefix = new AuthError().errorPrefix;
const innoErrorPrefix = new InnoError().errorPrefix;

function makeRequestAddress(port: number, resource: string): string {
    return `${host}:${port}${resource}`;
}

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

class TestController extends Controller {
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

    publicResourceWithAgent = async(ctx: Context, next: Function): Promise<void> => {
        ctx.body = ctx.state.userAgent;
        await next();
    }
}

const testController = new TestController();

router
    .post(publicResource, testController.publicResource)
    .post(protectedResource, testController.protectedResource)
    .get(publicResourceWithError, testController.publicResourceWithError)
    .post(publicResourceWithValidation, testController.publicResourceWithValidation)
    .get(publicResourceWithValidation, testController.publicResourceWithValidation)
    .post(publicResourceWithAgent, testController.publicResourceWithAgent);

/* tslint:disable:typedef */
describe('app', async function (): Promise<void> {
    before(async function () {
        const jwtApp = new App(jwtConfigMock, router);
        const app = new App(commonConfigMock, router);
        await jwtApp.bootstrap();
        await app.bootstrap();
    });

    describe('router', async function () {
        it('serves requests', async function () {
            const response = await request.post(makeRequestAddress(jwtPort, publicResource), {
                form: {},
                json: true
            });
            expect(response.result).to.eq(1);
        });

        it('validates requests', async function () {
            let response = await request.post(makeRequestAddress(jwtPort, publicResourceWithValidation), {
                qs: {},
                form: {
                    testQueryField: ' 1111 ',
                    testField: '   test@test.ru '
                },
                json: true
            });
            expect(response.result).to.eql({
                testField: 'test@test.ru',
                testQueryField: 1111
            });

            response = await request.get(makeRequestAddress(jwtPort, publicResourceWithValidation), {
                qs: {
                    testQueryField: ' 1111 ',
                    testField: '   test@test.ru '
                },
                json: true
            });
            expect(response.result).to.eql({
                testField: 'test@test.ru',
                testQueryField: 1111
            });
        });

        it('returns error when accessing protected resource with no key', async function () {
            const response = await request.post(makeRequestAddress(jwtPort, protectedResource), {
                form: {},
                json: true,
                simple: false
            });
            expect(response.error).to.eq(authErrorPrefix + AuthError.TOKEN_IS_INVALID);
        });

        it('serves protected request with passed key', async function () {
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

        it('makes all routes unprotected w/o jwt config', async function () {
            const response = await request.post(makeRequestAddress(commonPort, protectedResource), {
                form: {},
                json: true
            });
            expect(response.result).to.eq(2);
        });

        it('returns userAgent info', async function () {
            const agentKeys = ['isAuthoritative',
                'isMobile', 'isTablet', 'isiPad',
                'isiPod', 'isiPhone', 'isAndroid',
                'isBlackberry', 'isOpera', 'isIE', 'isEdge',
                'isIECompatibilityMode', 'isSafari',
                'isFirefox', 'isWebkit', 'isChrome',
                'isKonqueror', 'isOmniWeb', 'isSeaMonkey',
                'isFlock', 'isAmaya', 'isPhantomJS', 'isEpiphany',
                'isDesktop', 'isWindows', 'isLinux', 'isLinux64',
                'isMac', 'isChromeOS', 'isBada', 'isSamsung',
                'isRaspberry', 'isBot', 'isCurl', 'isAndroidTablet',
                'isWinJs', 'isKindleFire', 'isSilk',
                'isCaptive', 'isSmartTV', 'isUC',
                'silkAccelerated', 'browser',
                'os', 'platform', 'geoIp', 'source'
            ];

            const response = await request.post(makeRequestAddress(commonPort, publicResourceWithAgent), {
                form: {},
                json: true
            });
            expect(response.result).to.have.all.keys(agentKeys);
        });
    });

    describe('errors', async function () {
        it('returns error on non-existing resource', async function () {
            let response: any;
            try {
                response = await request.get(makeRequestAddress(commonPort, nonExistingResource), {
                    json: true
                });
            } catch (err) {
                response = err;
            }
            expect(response.statusCode).to.eq(404);
        });

        it('should catch error and return its code', async function () {
            const response = await request.get(makeRequestAddress(commonPort, publicResourceWithError), {
                json: true,
                simple: false
            });
            expect(response.error).to.eq(innoErrorPrefix + InnoError.INTERNAL);
        });

        it('should return validation error', async function () {
            let response = await request.post(makeRequestAddress(commonPort, publicResourceWithValidation), {
                form: {
                    testField: 'testValue'
                },
                json: true,
                simple: false
            });
            expect(response.error).to.eq(validationErrorPrefix + ValidationError.NO_EMAIL);
            expect(response.details).to.eql({
                invalidField: 'testField',
                invalidValue: 'testValue'
            });
        });
    });
});