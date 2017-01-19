/**
 * Promise обертка для node fs. Отличается в использовании тем, что нет необходимости
 * передавать callback и методы возвращают promise.
 *
 * fs.readFile('test.txt', 'utf-8').then((text) => {console.log(text)});
 * или
 * const text = await fs.readFile('text.txt', 'utf-8');
 *
 */

import * as fsNative from 'fs';
import promisify = require('promisify-node');

const fs = promisify(fsNative);

export {fs};