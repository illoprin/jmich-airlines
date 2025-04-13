"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Storage = void 0;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
class Storage {
    constructor(storagePath) {
        try {
            this.db = (0, better_sqlite3_1.default)(storagePath);
        }
        catch (err) {
            throw err;
        }
    }
    get(sql, params) {
        try {
            const stmt = this.db.prepare(sql);
            const runResult = stmt.get(params);
            return runResult;
        }
        catch (err) {
            // WARN: naitive methods to process sqlite errors is not found
            throw err;
        }
    }
    all(sql, params) {
        try {
            const stmt = this.db.prepare(sql);
            const runResult = stmt.all(params);
            return runResult;
        }
        catch (err) {
            // WARN: naitive methods to process sqlite errors is not found
            throw err;
        }
    }
    run(sql, params) {
        try {
            const stmt = this.db.prepare(sql);
            const { lastInsertRowid, changes } = stmt.run(params);
            return { lastID: lastInsertRowid, changes };
        }
        catch (err) {
            // WARN: naitive methods to process sqlite errors is not found
            throw err;
        }
    }
    close() {
        this.db.close();
    }
}
exports.Storage = Storage;
