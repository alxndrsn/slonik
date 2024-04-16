"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createSqlTag_1 = require("../../../factories/createSqlTag");
const createPool_1 = require("../../../helpers/createPool");
const ava_1 = __importDefault(require("ava"));
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('overrides result row (sync)', async (t) => {
    const pool = await (0, createPool_1.createPool)({
        interceptors: [
            {
                transformRow: () => {
                    return {
                        foo: 2,
                    };
                },
            },
        ],
    });
    pool.querySpy.returns({
        command: 'SELECT',
        fields: [],
        rowCount: 1,
        rows: [
            {
                foo: 1,
            },
        ],
        type: 'QueryResult',
    });
    const result = await pool.query(sql.unsafe `SELECT 1`);
    t.deepEqual(result, {
        command: 'SELECT',
        fields: [],
        notices: [],
        rowCount: 1,
        rows: [
            {
                foo: 2,
            },
        ],
        type: 'QueryResult',
    });
});
(0, ava_1.default)('overrides result row (async)', async (t) => {
    const pool = await (0, createPool_1.createPool)({
        interceptors: [
            {
                transformRow: () => {
                    return Promise.resolve({
                        foo: 2,
                    });
                },
            },
        ],
    });
    pool.querySpy.returns({
        command: 'SELECT',
        fields: [],
        rowCount: 1,
        rows: [
            {
                foo: 1,
            },
        ],
        type: 'QueryResult',
    });
    const result = await pool.query(sql.unsafe `SELECT 1`);
    t.deepEqual(result, {
        command: 'SELECT',
        fields: [],
        notices: [],
        rowCount: 1,
        rows: [
            {
                foo: 2,
            },
        ],
        type: 'QueryResult',
    });
});
//# sourceMappingURL=transformRow.test.js.map