import { expect } from 'chai';
import * as jsonWebToken from 'jsonwebtoken';
import * as Router from 'koa-router';
import * as request from 'request-promise';
import { InnotsApp } from '../../index';
import { AuthError } from "../../lib/error/auth";
import { InnoError } from "../../lib/error/inno";
import { ValidationError } from "../../lib/error/validation";
import {
    commonConfigMock,
    commonPort,
    host,
    jwtConfigMock,
    jwtPort,
    jwtSecret,
    nonExistingResource,
    protectedResource,
    publicResource,
    publicResourceWithAgent,
    publicResourceWithError,
    publicResourceWithMiddlewareValidation,
    publicResourceWithValidation,
    testController
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
        const jwtApp = new InnotsApp(jwtConfigMock, router);

        const app = new InnotsApp(commonConfigMock);

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
                    test_field: joi.string().trim().email().required(),
                    testQueryField: joi.number().integer(),
                    test_field_to_escape: joi.string().trim().max(100),
                    test_field_not_to_escape: joi.unescapedString().trim().max(100).required()
                });
            }),
            testController.publicResourceWithMiddlewareValidation
        );
        app.route(
            'get',
            publicResourceWithMiddlewareValidation,
            ((joi) => {
                return joi.object().keys({
                    test_field: joi.string().trim().email().required(),
                    testQueryField: joi.number().integer(),
                    test_field_to_escape: joi.string().trim().max(100)
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
                    test_field: '   test@test.ru ',
                    test_field_to_escape: "'alert(1);<a>",
                    test_field_not_to_escape: "'alert(1);<a>"
                },
                json: true
            });
            expect(response.result).to.eql({
                originalCase: {
                    test_field: 'test@test.ru',
                    testQueryField: 1111,
                    test_field_to_escape: '&#x27;alert(1);&lt;a&gt;',
                    test_field_not_to_escape: "'alert(1);<a>"
                },
                camelCase: {
                    testField: 'test@test.ru',
                    testQueryField: 1111,
                    testFieldToEscape: '&#x27;alert(1);&lt;a&gt;',
                    testFieldNotToEscape: "'alert(1);<a>"
                }
            });

            response = await request.get(makeRequestAddress(commonPort, publicResourceWithMiddlewareValidation), {
                qs: {
                    testQueryField: ' 1111 ',
                    test_field: '   test@test.ru ',
                    test_field_to_escape: "'alert(1);<a>"
                },
                json: true
            });
            expect(response.result).to.eql({
                originalCase: {
                    test_field: 'test@test.ru',
                    testQueryField: 1111,
                    test_field_to_escape: '&#x27;alert(1);&lt;a&gt;'
                },
                camelCase: {
                    testField: 'test@test.ru',
                    testQueryField: 1111,
                    testFieldToEscape: '&#x27;alert(1);&lt;a&gt;'
                }
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
                    test_field: 'testValue'
                },
                json: true,
                simple: false
            });
            expect(response.error).to.eq(validationErrorPrefix + ValidationError.DEFAULT);
            expect(response.details).to.eql({
                invalidField: 'test_field',
                invalidValue: 'testValue',
                message: '"test_field" must be a valid email',
                type: 'string.email'
            });
        });
    });
});