"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const errors_1 = require("../../../src/errors");
const createSqlTag_1 = require("../../../src/factories/createSqlTag");
const createPool_1 = require("../../helpers/createPool");
const sql = createSqlTag_1.createSqlTag();
ava_1.default('returns the first row', async (t) => {
    const pool = createPool_1.createPool();
    pool.querySpy.returns({
        rows: [
            {
                foo: 1,
            },
        ],
    });
    const result = await pool.maybeOneFirst(sql `SELECT 1`);
    t.is(result, 1);
});
ava_1.default('returns null if no results', async (t) => {
    const pool = createPool_1.createPool();
    pool.querySpy.returns({
        rows: [],
    });
    const result = await pool.maybeOneFirst(sql `SELECT 1`);
    t.assert(result === null);
});
ava_1.default('throws an error if more than one row is returned', async (t) => {
    const pool = createPool_1.createPool();
    pool.querySpy.returns({
        rows: [
            {
                foo: 1,
            },
            {
                foo: 2,
            },
        ],
    });
    const error = await t.throwsAsync(pool.maybeOneFirst(sql `SELECT 1`));
    t.true(error instanceof errors_1.DataIntegrityError);
});
ava_1.default('throws an error if more than one column is returned', async (t) => {
    const pool = createPool_1.createPool();
    pool.querySpy.returns({
        rows: [
            {
                bar: 1,
                foo: 1,
            },
        ],
    });
    const error = await t.throwsAsync(pool.maybeOneFirst(sql `SELECT 1`));
    t.true(error instanceof errors_1.DataIntegrityError);
});
//# sourceMappingURL=maybeOneFirst.js.map