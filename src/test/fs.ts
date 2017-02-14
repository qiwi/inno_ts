import * as fs from '../lib/fs';
import * as fsNative from 'fs';
import {expect} from 'chai';

describe('fs', function(): void {
    it('do not modifies native fs object', function(done: Function): void {
        expect(fs).not.to.eq(fsNative);
        expect(fsNative.readFile('test', () => { return; })).to.be.undefined;
        done();
    });
});