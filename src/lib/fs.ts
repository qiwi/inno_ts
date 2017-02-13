/**
 * Promise wrapper for fs. We keep this wrap to save backward compatibility.
 * fs.readFile('test.txt', 'utf-8').then((text) => {console.log(text)});
 * or
 * const text = await fs.readFile('text.txt', 'utf-8');
 *
 */
import * as fs from 'fs-promise';

export {fs};