import * as fsNative from 'fs';
import promisify = require('promisify-node');

export default promisify(fsNative);