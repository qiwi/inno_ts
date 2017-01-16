"use strict";
const fsNative = require("fs");
const promisify = require("promisify-node");
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = promisify(fsNative);
