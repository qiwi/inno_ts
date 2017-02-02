import {expect} from 'chai';
import {InnoError} from "../lib/error/error";
import {ValidationError} from "../lib/error/validation";
import {AuthError} from "../lib/error/auth";
import {DefaultError} from "../lib/error/default";

function assertErrorResult(error: InnoError, expectedErrorName: string, expectedErrorMessage: string): void {
    const date = (new Date()).toISOString();
    expect(error.name).to.eq(expectedErrorName);
    // TODO use regular expr
    expect(error.message.substring(date.length + 1, error.message.length)).to.eq(expectedErrorMessage);
}

/* tslint:disable:typedef */
describe('error', function() {
    it('Default', function (done: Function) {
        const expected = '\nERROR_CODE: ERROR_TEST_CODE \nERROR_HTTP_STATUS: 400 ' +
            '\nERROR_INNER_DETAILS: {\n  "foo": 1\n} ' +
            '\nERROR_DETAILS: {}';
        try {
            throw new DefaultError('TEST_CODE', 400, {foo: 1});
        } catch (error) {
            assertErrorResult(error, 'DefaultError', expected);
            done();
        }
    });
    it('Auth', function(done: Function) {
        const expected = '\nERROR_CODE: ERROR_AUTH_TOKEN_IS_INVALID \nERROR_HTTP_STATUS: 401 ' +
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
        const expected = '\nERROR_CODE: ERROR_VALIDATION_NO_STRING \nERROR_HTTP_STATUS: 400 ' +
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