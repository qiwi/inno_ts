import {expect} from 'chai';
import {ItemValidator} from '../../lib/validation/item_validator';
import {ValidationError} from "../../lib/error/validation";
import {Validator} from "../../lib/validation/validator";

const testString = (new Array(2000)).toString();
const validationErrorPrefix = new ValidationError().errorPrefix;

let itemValidator: ItemValidator;

/* tslint:disable:typedef */
describe('validator', function() {
    before(function(done) {
        itemValidator = new ItemValidator({
            number: 10,
            numericStringWithSpaces: ' 12312312312  ',
            longString: testString,
            emptyString: '',
            stringWithSpaces: '    ',
            boolean: true,
            object: {},
            plusInf: Infinity,
            minusInf: -Infinity,
            emptyArray: [],
            stringArray: ['foo', '1', ' bar ']
        });
        done();
    });

    describe('isInt', function() {
        it('numeric string', function() {
            expect(itemValidator.isInt('numericStringWithSpaces')).to.eq(12312312312);
        });

        it('returns valid error details', function(done) {
            try {
                itemValidator.isInt('boolean');
            } catch (error) {
                expect(error).to.be.instanceof(ValidationError);
                expect(error.code).to.eq(validationErrorPrefix + ValidationError.NO_STRING);
                expect(error.details).to.eql({
                    invalidField: 'boolean',
                    invalidValue: true
                });
                done();
            }
        });

        it('numeric string with small bounds', function() {
            expect(function() {
                itemValidator.isInt('numericStringWithSpaces', 0, 5);
            }).to.throw(ValidationError);
        });

        it('boolean', function() {
            expect(function() {
                itemValidator.isInt('boolean');
            }).to.throw(ValidationError);
        });

        it('object', function() {
            expect(function() {
                itemValidator.isInt('object');
            }).to.throw(ValidationError);
        });

        it('Infinity', function() {
            expect(function() {
                itemValidator.isInt('plusInf');
            }).to.throw(ValidationError);
            expect(function() {
                itemValidator.isInt('minusInf');
            }).to.throw(ValidationError);
        });
    });

    describe('isString', function() {
        it('number', function() {
            expect(itemValidator.isString('number')).to.eq('10');
        });

        it('string', function() {
            expect(itemValidator.isString('numericStringWithSpaces')).to.eq('12312312312');
        });

        it('short_string', function() {
            expect(itemValidator.isString('emptyString', 0)).to.eq('');
        });

        it('returns valid error details', function(done) {
            try {
                itemValidator.isString('longString');
            } catch (error) {
                expect(error).to.be.instanceof(ValidationError);
                expect(error.code).to.eq(validationErrorPrefix + ValidationError.STRING_OUT_OF_BOUNDS);
                expect(error.details).to.eql({
                    invalidField: 'longString',
                    invalidValue: testString
                });
                done();
            }
        });

        it('string with small bounds', function() {
            expect(function() {
                itemValidator.isString('numericStringWithSpaces', 0, 5);
            }).to.throw(ValidationError);
        });

        it('empty string', function() {
            expect(function() {
                itemValidator.isString('emptyString');
            }).to.throw(ValidationError);
        });

        it('spaces', function() {
            expect(function() {
                itemValidator.isString('stringWithSpaces');
            }).to.throw(ValidationError);
        });

        it('optional', function() {
            expect(itemValidator.optional.isString('nothing')).to.eq(null);
        });
    });

    describe('isArray', function() {
        it('returns valid error details', function(done) {
            try {
                itemValidator.isArray('emptyArray');
            } catch (error) {
                expect(error).to.be.instanceof(ValidationError);
                expect(error.code).to.eq(validationErrorPrefix + ValidationError.NO_ARRAY);
                expect(error.details).to.eql({
                    invalidField: 'emptyArray',
                    invalidValue: []
                });
                done();
            }
        });

        it('valid array', function() {
            expect(itemValidator.isArray('stringArray')).to.eql(['foo', '1', ' bar ']);
        });

        it('string array with isString iterator', function() {
            expect(itemValidator.isArray<string>('stringArray', Validator.isString)).to.eql(['foo', '1', 'bar']);
        });

        it('string array with isEmail iterator', function() {
            expect(function() {
                itemValidator.isArray('stringArray', Validator.isEmail);
            }).to.throw(ValidationError);
        });

        it('optional', function() {
            expect(itemValidator.optional.isString('nothing')).to.eq(null);
        });
    });
});