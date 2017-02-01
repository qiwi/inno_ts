import {expect} from 'chai';
import {InnoError} from "../lib/error/error";
import {ValidationError} from "../lib/error/validation";
describe('error', function() {
    it('should produce valid error message', function(done) {
        const date = (new Date).toISOString();

        const expected = '\nERROR_CODE: ERROR_VALIDATION_NO_STRING \nERROR_HTTP_STATUS: 400 ' +
            '\nERROR_INNER_DETAILS: {\n  "foo": 1\n} ' +
            '\nERROR_DETAILS: {}';
        try {
            throw new ValidationError({
                code: ValidationError.NO_STRING,
                innerDetails: {foo: 1}
            });
        } catch(error) {
            expect(error.name).to.eq('ValidationError');
            // TODO use regular expr
            expect(error.message.substring(date.length + 1, error.message.length)).to.eq(expected);
            done();
        }
    });
});