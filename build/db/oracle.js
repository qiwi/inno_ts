"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const oracledb = require("oracledb");
const error_1 = require("../error");
exports.DB_CONNECT_ERROR = 'DB_QUERY';
exports.DB_ORACLE_ERROR = 'DB_ORACLE_ERROR';
exports.DB_ORACLE_FETCH_ERROR = 'DB_ORACLE_FETCH_ERROR';
exports.DB_ORACLE_CLOSE_ERROR = 'DB_ORACLE_CLOSE_ERROR';
exports.DB_ORACLE_RELEASE_ERROR = 'DB_ORACLE_RELEASE_ERROR';
class OracleService {
    constructor(connectionParams) {
        this.connectionParams = connectionParams;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connection = yield oracledb.getConnection(this.connectionParams);
                console.log((new Date()).toString() + ' Oracle connected');
            }
            catch (error) {
                throw new error_1.ResultError(exports.DB_CONNECT_ERROR, 500, error.message);
            }
        });
    }
    ;
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connection.release();
            }
            catch (error) {
                throw new error_1.ResultError(exports.DB_ORACLE_RELEASE_ERROR, 500, error.message);
            }
        });
    }
    ;
    getManyRows(query, params = []) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.connection.execute(query, params, { resultSet: true, prefetchRows: 500 });
            }
            catch (error) {
                throw new error_1.ResultError(exports.DB_ORACLE_ERROR, 500, query + '\n' + error.message + '\n' + params.toString());
            }
        });
    }
    ;
    fetchRows(resultSet, numRows) {
        return __awaiter(this, void 0, void 0, function* () {
            let rows;
            try {
                rows = yield resultSet.getRows(numRows);
            }
            catch (error) {
                yield this.closeResultSet(resultSet);
                throw new error_1.ResultError(exports.DB_ORACLE_FETCH_ERROR, 500, error.message);
            }
            if (rows.length == 0) {
                yield this.closeResultSet(resultSet);
                return [];
            }
            return rows;
        });
    }
    ;
    closeResultSet(resultSet, closeConnection = false) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield resultSet.close();
            }
            catch (error) {
                throw new error_1.ResultError(exports.DB_ORACLE_CLOSE_ERROR, 500, error.message);
            }
            if (closeConnection) {
                yield this.disconnect();
            }
        });
    }
    ;
    getRows(sql, bindParams = [], options = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.connection.execute(sql, bindParams, options);
                return result.rows;
            }
            catch (error) {
                throw new error_1.ResultError(exports.DB_ORACLE_ERROR, 500, sql + '\n' + error.message + '\n' + bindParams.toString());
            }
        });
    }
    ;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = OracleService;
;
