import {expect} from 'chai';
import {Validator, VALIDATION_NO_INT, DEFAULT_CODE} from '../lib/validation/validator';
import {ResultError} from "../lib/error";

describe('validator', function() {
    describe('isInt', function() {
        it('numeric string', function() {
            expect(Validator.isInt(" 123123 ")).to.eq(123123);
        });

        it('boolean', function() {
            expect(function() {Validator.isInt(true)}).to.throw(ResultError);
        });

        it('object', function() {
            expect(function() {Validator.isInt({})}).to.throw(ResultError);
        });

        it('Infinity', function() {
            expect(function() {Validator.isInt(Infinity)}).to.throw(ResultError);
            expect(function() {Validator.isInt(-Infinity)}).to.throw(ResultError);
        });
    });

    describe('isString', function() {
        it('string', function() {
            expect(Validator.isString(" 123123 ")).to.eq("123123");
        });

        it('long string', function() {
            const arr = new Array(2000);
            expect(function() {Validator.isString(arr.toString())}).to.throw(ResultError);
        });

        it('empty string', function() {
            expect(function() {Validator.isString('')}).to.throw(ResultError);
        });

        it('spaces', function() {
            expect(function() {Validator.isString('   ')}).to.throw(ResultError);
        });
    })
});