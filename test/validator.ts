import {expect} from 'chai';
import {Validator, VALIDATION_NO_INT, DEFAULT_CODE} from '../src/validation/validator';
import {ResultError} from "../src/error";
import {VALIDATION_NO_STRING} from "../src/validation/validator";

describe('validator', function () {
    describe('isInt', function() {
        it('numeric string', function() {
            expect(Validator.isInt(" 123123 ")).to.eq(123123);
        });

        // it('number', function() {
        //     expect(Validator.isInt(100)).to.eq(100);
        // });

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
});