import * as fsNative from 'fs';
import promisify = require('promisify-node');

const fs = promisify(fsNative);

export {fs};