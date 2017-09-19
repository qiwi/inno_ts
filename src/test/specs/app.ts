import * as Router from 'koa-router';
import {App} from '../../index';
import * as request from 'request-promise';
import {expect} from 'chai';
import * as jsonWebToken from 'jsonwebtoken';
import * as Koa from 'koa';
import Context = Koa.Context;
import {ValidationError} from "../../lib/error/validation";
import {AuthError} from "../../lib/error/auth";
import {InnoError} from "../../lib/error/inno";
import {
    host, jwtConfigMock, commonConfigMock, jwtPort, jwtSecret, commonPort, testController,
    publicResource,
    protectedResource,
    publicResourceWithError, publicResourceWithValidation, publicResourceWithAgent, nonExistingResource,
    publicResourceWithMiddlewareValidation
} from '../data';

const router = new Router();

const validationErrorPrefix = new ValidationError().errorPrefix;
const authErrorPrefix = new AuthError().errorPrefix;
const innoErrorPrefix = new InnoError().errorPrefix;

function makeRequestAddress(port: number, resource: string): string {
    return `${host}:${port}${resource}`;
}

router
    .post(publicResource, testController.publicResource)
    .post(protectedResource, testController.protectedResource)
    .get(publicResourceWithError, testController.publicResourceWithError)
    .post(publicResourceWithValidation, testController.publicResourceWithValidation)
    .get(publicResourceWithValidation, testController.publicResourceWithValidation)
    .post(publicResourceWithAgent, testController.publicResourceWithAgent);

/* tslint:disable:typedef */
describe('app', async function(): Promise<void> {
    before(async function() {
        const jwtApp = new App(jwtConfigMock, router);

        const app = new App(commonConfigMock);

        app.route('post', publicResource, testController.publicResource);
        app.route('post', protectedResource, testController.protectedResource);
        app.route('get', publicResourceWithError, testController.publicResourceWithError);
        app.route('post', publicResourceWithValidation, testController.publicResourceWithValidation);
        app.route('get', publicResourceWithValidation, testController.publicResourceWithValidation);
        app.route('post', publicResourceWithAgent, testController.publicResourceWithAgent);
        app.route(
            'post',
            publicResourceWithMiddlewareValidation,
            ((joi) => {
                return joi.object().keys({
                    testField: joi.string().trim().email().required(),
                    testQueryField: joi.number().integer()
                });
            }),
            testController.publicResourceWithMiddlewareValidation
        );
        app.route(
            'get',
            publicResourceWithMiddlewareValidation,
            ((joi) => {
                return joi.object().keys({
                    testField: joi.string().trim().email().required(),
                    testQueryField: joi.number().integer()
                });
            }),
            testController.publicResourceWithMiddlewareValidation
        );

        await jwtApp.bootstrap();
        await app.bootstrap();
    });

    describe('router', async function() {
        it('serves requests', async function() {
            const response = await request.post(makeRequestAddress(jwtPort, publicResource), {
                form: {},
                json: true
            });
            expect(response.result).to.eq(1);
        });

        it('validates and processes request data', async function() {
            let response = await request.post(makeRequestAddress(jwtPort, publicResourceWithValidation), {
                qs: {},
                form: {
                    testQueryField: ' 1111 ',
                    testField: '   test@test.ru ',
                    someOtherData: 122
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
                    testField: '   test@test.ru ',
                    someOtherData: 122,
                    someYetOtherData: 12211
                },
                json: true
            });
            expect(response.result).to.eql({
                testField: 'test@test.ru',
                testQueryField: 1111
            });
        });

        it('validates and processes request data (middleware)', async function() {
            let response = await request.post(makeRequestAddress(commonPort, publicResourceWithMiddlewareValidation), {
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

            response = await request.get(makeRequestAddress(commonPort, publicResourceWithMiddlewareValidation), {
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

        it('returns error when accessing protected resource with no key', async function() {
            const response = await request.post(makeRequestAddress(jwtPort, protectedResource), {
                form: {},
                json: true,
                simple: false
            });
            expect(response.error).to.eq(authErrorPrefix + AuthError.TOKEN_IS_INVALID);
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

        it('returns userAgent info', async function() {
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

    describe('errors', async function() {
        it('returns error on non-existing resource', async function() {
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

        it('should catch error and return its code', async function() {
            const response = await request.get(makeRequestAddress(commonPort, publicResourceWithError), {
                json: true,
                simple: false
            });
            expect(response.error).to.eq(innoErrorPrefix + InnoError.INTERNAL);
        });

        it('should return validation error', async function() {
            const response = await request.post(makeRequestAddress(commonPort, publicResourceWithValidation), {
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

        it('should return validation error (middleware)', async function() {
            const response = await request.post(
                makeRequestAddress(commonPort, publicResourceWithMiddlewareValidation
            ), {
                form: {
                    testField: 'testValue'
                },
                json: true,
                simple: false
            });
            expect(response.error).to.eq(validationErrorPrefix + ValidationError.DEFAULT);
            expect(response.details).to.eql({
                invalidField: 'testField',
                invalidValue: 'testValue',
                message: '"testField" must be a valid email'
            });
        });
    });
});