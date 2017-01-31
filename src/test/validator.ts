import {expect} from 'chai';
import {Validator} from '../lib/validation/validator';
import {ValidationError} from "../lib/error/validation";

describe('validator', function() {
    describe('isInt', function() {
        it('numeric string', function() {
            expect(Validator.isInt(" 123123 ")).to.eq(123123);
        });

        it('boolean', function() {
            expect(function() {Validator.isInt(true)}).to.throw(ValidationError);
        });

        it('object', function() {
            expect(function() {Validator.isInt({})}).to.throw(ValidationError);
        });

        it('Infinity', function() {
            expect(function() {Validator.isInt(Infinity)}).to.throw(ValidationError);
            expect(function() {Validator.isInt(-Infinity)}).to.throw(ValidationError);
        });
    });

    describe('isString', function() {
        it('string', function() {
            expect(Validator.isString(" 123123 ")).to.eq("123123");
        });

        it('long string', function() {
            const arr = new Array(2000);
            expect(function() {Validator.isString(arr.toString())}).to.throw(ValidationError);
        });

        it('empty string', function() {
            expect(function() {Validator.isString('')}).to.throw(ValidationError);
        });

        it('spaces', function() {
            expect(function() {Validator.isString('   ')}).to.throw(ValidationError);
        });
    })
});