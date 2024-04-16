"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../errors");
const createSqlTag_1 = require("../factories/createSqlTag");
const createPool_1 = require("../helpers/createPool");
const ava_1 = __importDefault(require("ava"));
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('returns the first row', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    pool.querySpy.returns({
        rows: [
            {
                foo: 1,
            },
        ],
    });
    const result = await pool.maybeOne(sql.unsafe `SELECT 1`);
    t.deepEqual(result, {
        foo: 1,
    });
});
(0, ava_1.default)('returns null if no results', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    pool.querySpy.returns({
        rows: [],
    });
    const result = await pool.maybeOne(sql.unsafe `SELECT 1`);
    t.is(result, null);
});
(0, ava_1.default)('throws an error if more than one row is returned', async (t) => {
    const pool = await (0, createPool_1.createPool)();
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
    const error = await t.throwsAsync(pool.maybeOne(sql.unsafe `SELECT 1`));
    t.true(error instanceof errors_1.DataIntegrityError);
});
//# sourceMappingURL=maybeOne.test.js.map