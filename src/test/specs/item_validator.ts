import { expect } from 'chai';
import { ValidationError } from "../../lib/error/validation";
import { ItemValidator } from '../../lib/validation/item_validator';
import { Validator } from "../../lib/validation/validator";

const testString = (new Array(2000)).toString();
const validationErrorPrefix = new ValidationError().errorPrefix;

let itemValidator: ItemValidator;

describe('validator', () => {
    before(() => {
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
            stringArray: ['foo', '1', ' bar '],
            floatString: '10212.12',
            validDateTime: '1970-01-02T10:30:50.000Z',
            validDate: '1970-01-02',
            invalidDate: '02.01.1970'
        });
    });

    describe('isInt', () => {
        it('numeric string', () => {
            expect(itemValidator.isInt('numericStringWithSpaces')).to.eq(12312312312);
        });

        it('returns valid error details', () => {
            try {
                itemValidator.isInt('boolean');
            } catch (error) {
                expect(error).to.be.instanceof(ValidationError);
                expect(error.code).to.eq(validationErrorPrefix + ValidationError.NO_STRING);
                expect(error.details).to.eql({
                    invalidField: 'boolean',
                    invalidValue: true
                });
            }
        });

        it('numeric string with small bounds', () => {
            expect(() => {
                itemValidator.isInt('numericStringWithSpaces', 0, 5);
            }).to.throw(ValidationError);
        });

        it('boolean', () => {
            expect(() => {
                itemValidator.isInt('boolean');
            }).to.throw(ValidationError);
        });

        it('object', () => {
            expect(() => {
                itemValidator.isInt('object');
            }).to.throw(ValidationError);
        });

        it('Infinity', () => {
            expect(() => {
                itemValidator.isInt('plusInf');
            }).to.throw(ValidationError);
            expect(() => {
                itemValidator.isInt('minusInf');
            }).to.throw(ValidationError);
        });
    });

    describe('isNumber', () => {
        it('numeric string', () => {
            expect(itemValidator.isNumber('numericStringWithSpaces')).to.eq(12312312312);
        });

        it('float string', () => {
            expect(itemValidator.isNumber('floatString')).to.eq(10212.12);
        });

        it('returns valid error details', () => {
            try {
                itemValidator.isNumber('boolean');
            } catch (error) {
                expect(error).to.be.instanceof(ValidationError);
                expect(error.code).to.eq(validationErrorPrefix + ValidationError.NO_STRING);
                expect(error.details).to.eql({
                    invalidField: 'boolean',
                    invalidValue: true
                });
            }
        });

        it('numeric string with small bounds', () => {
            expect(() => {
                itemValidator.isNumber('numericStringWithSpaces', 0, 5);
            }).to.throw(ValidationError);
        });

        it('boolean', () => {
            expect(() => {
                itemValidator.isNumber('boolean');
            }).to.throw(ValidationError);
        });

        it('object', () => {
            expect(() => {
                itemValidator.isNumber('object');
            }).to.throw(ValidationError);
        });

        it('Infinity', () => {
            expect(() => {
                itemValidator.isNumber('plusInf');
            }).to.throw(ValidationError);
            expect(() => {
                itemValidator.isNumber('minusInf');
            }).to.throw(ValidationError);
        });
    });

    describe('isString', () => {
        it('number', () => {
            expect(itemValidator.isString('number')).to.eq('10');
        });

        it('string', () => {
            expect(itemValidator.isString('numericStringWithSpaces')).to.eq('12312312312');
        });

        it('short_string', () => {
            expect(itemValidator.isString('emptyString', 0)).to.eq('');
        });

        it('returns valid error details', () => {
            try {
                itemValidator.isString('longString');
            } catch (error) {
                expect(error).to.be.instanceof(ValidationError);
                expect(error.code).to.eq(validationErrorPrefix + ValidationError.STRING_OUT_OF_BOUNDS);
                expect(error.details).to.eql({
                    invalidField: 'longString',
                    invalidValue: testString
                });
            }
        });

        it('string with small bounds', () => {
            expect(() => {
                itemValidator.isString('numericStringWithSpaces', 0, 5);
            }).to.throw(ValidationError);
        });

        it('empty string', () => {
            expect(() => {
                itemValidator.isString('emptyString');
            }).to.throw(ValidationError);
        });

        it('spaces', () => {
            expect(() => {
                itemValidator.isString('stringWithSpaces');
            }).to.throw(ValidationError);
        });

        it('optional', () => {
            expect(itemValidator.optional.isString('nothing')).to.eq(null);
        });
    });

    describe('isArray', () => {
        it('returns valid error details', () => {
            try {
                itemValidator.isArray('emptyArray');
            } catch (error) {
                expect(error).to.be.instanceof(ValidationError);
                expect(error.code).to.eq(validationErrorPrefix + ValidationError.NO_ARRAY);
                expect(error.details).to.eql({
                    invalidField: 'emptyArray',
                    invalidValue: []
                });
            }
        });

        it('valid array', () => {
            expect(itemValidator.isArray('stringArray')).to.eql(['foo', '1', ' bar ']);
        });

        it('string array with isString iterator', () => {
            expect(itemValidator.isArray<string>('stringArray', Validator.isString)).to.eql(['foo', '1', 'bar']);
        });

        it('string array with isEmail iterator', () => {
            expect(() => {
                itemValidator.isArray('stringArray', Validator.isEmail);
            }).to.throw(ValidationError);
        });

        it('optional', () => {
            expect(itemValidator.optional.isString('nothing')).to.eq(null);
        });
    });

    describe('isDate', () => {
        it('returns invalid date error details', () => {
            try {
                itemValidator.isDate('invalidDate');
            } catch (error) {
                expect(error).to.be.instanceof(ValidationError);
                expect(error.code).to.eq(validationErrorPrefix + ValidationError.NO_DATE);
                expect(error.details).to.eql({
                    invalidField: 'invalidDate',
                    invalidValue: '02.01.1970'
                });
            }
        });

        it('returns valid date out of bounds details', () => {
            try {
                itemValidator.isDate('validDate', new Date());
            } catch (error) {
                expect(error).to.be.instanceof(ValidationError);
                expect(error.code).to.eq(validationErrorPrefix + ValidationError.DATE_OUT_OF_BOUNDS);
                expect(error.details).to.eql({
                    invalidField: 'validDate',
                    invalidValue: '1970-01-02'
                });
            }
        });

        it('returns valid date with time', () => {
            expect(itemValidator.isDate('validDateTime'))
                .to.eql(new Date('Fri Jan 02 1970 13:30:50 GMT+0300'));
        });

        it('optional', () => {
            expect(itemValidator.optional.isDate('nothing')).to.eq(null);
        });
    });
});