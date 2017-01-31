import {expect} from 'chai';
import {InnoError} from "../lib/error/error";
describe('error', function() {
    it('should produce valid error message', function(done) {
        const date = (new Date).toISOString();

        const expected = 'An error occurred:' +
            ' \nERROR_CODE: ERROR_INTERNAL \nERROR_HTTP_STATUS: 500 \nERROR_LOG_OBJECT: {\n  "foo": 1\n}';
        try {
            throw new InnoError(InnoError.INTERNAL, {foo: 1});
        } catch(error) {
            // TODO use regular expr
            console.log(error.message);
            expect(error.message.substring(date.length + 1, error.message.length)).to.eq(expected);
            done();
        }
    });
});