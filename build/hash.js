"use strict";
const crypto = require("crypto");
class Hash {
    static getSha256(value) {
        return crypto.createHash('sha256').update(value).digest('hex');
    }
}
exports.Hash = Hash;
