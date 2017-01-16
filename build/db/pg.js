"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const error_1 = require("../error");
exports.DB_QUERY = 'DB_QUERY';
exports.ONE_ROW_WARNING = 'WARNING_DB_GET_ROW. Expected 1 row. Got %j %s';
exports.NO_ROW_ERROR = 'DB_NO_SUCH_';
class PgService {
    constructor(pgPool) {
        this.pool = pgPool;
    }
    ;
    __run(query, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.pool.query(query, params);
            }
            catch (err) {
                throw new error_1.ResultError(exports.DB_QUERY, 500, query);
            }
        });
    }
    run(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.__run(query, params);
        });
    }
    getRows(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let items = yield this.__run(query, params);
            return items.rows;
        });
    }
    getRow(query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.__run(query, params);
            const rows = items.rows || [];
            if (rows.length == 0) {
                return false;
            }
            if (rows.length > 1) {
                console.log(exports.ONE_ROW_WARNING, rows.length, query);
            }
            return rows[0];
        });
    }
    mustGetRow(errorCode, query, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow(query, params);
            if (row === false) {
                throw new error_1.ResultError(exports.NO_ROW_ERROR, errorCode);
            }
            return row;
        });
    }
}
exports.PgService = PgService;
