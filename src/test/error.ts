import {expect} from 'chai';
import {BaseError} from "../lib/error/base";
import {ValidationError} from "../lib/error/validation";
import {AuthError} from "../lib/error/auth";
import {InnoError} from "../lib/error/inno";

const validationErrorPrefix = new ValidationError().errorPrefix;
const authErrorPrefix = new AuthError().errorPrefix;

function assertErrorResult(error: BaseError, expectedErrorName: string, expectedErrorMessage: string): void {
    const date = (new Date()).toISOString();
    expect(error.name).to.eq(expectedErrorName);
    // TODO use regular expr
    expect(error.message.substring(date.length + 1, error.message.length)).to.eq(expectedErrorMessage);
}

/* tslint:disable:typedef */
describe('error', function() {
    it('Inno', function (done: Function) {
        const expected = `\nERROR_CODE: ERROR_TEST_CODE \nERROR_HTTP_STATUS: ${BaseError.CODE_BAD_REQUEST} ` +
            '\nERROR_INNER_DETAILS: {\n  "foo": 1\n} ' +
            '\nERROR_DETAILS: {}';
        try {
            throw new InnoError('TEST_CODE', BaseError.CODE_BAD_REQUEST, {foo: 1});
        } catch (error) {
            assertErrorResult(error, 'InnoError', expected);
            done();
        }
    });
    it('Auth', function(done: Function) {
        const expected = `\nERROR_CODE: ${authErrorPrefix + AuthError.TOKEN_IS_INVALID} ` +
            `\nERROR_HTTP_STATUS: ${AuthError.CODE_UNAUTHORIZED} ` +
            '\nERROR_INNER_DETAILS: {} ' +
            '\nERROR_DETAILS: {}';
        try {
            throw new AuthError(AuthError.TOKEN_IS_INVALID);
        } catch (error) {
            assertErrorResult(error, 'AuthError', expected);
            done();
        }
    });
    it('ValidationError', function(done: Function) {
        const expected = `\nERROR_CODE: ${validationErrorPrefix + ValidationError.NO_STRING} ` +
            `\nERROR_HTTP_STATUS: ${ValidationError.CODE_BAD_REQUEST} ` +
            '\nERROR_INNER_DETAILS: {} ' +
            '\nERROR_DETAILS: {\n  "invalidField": "testField",\n  "invalidValue": true\n}';
        try {
            throw new ValidationError(ValidationError.NO_STRING, 'testField', true);
        } catch (error) {
            assertErrorResult(error, 'ValidationError', expected);
            done();
        }
    });
});