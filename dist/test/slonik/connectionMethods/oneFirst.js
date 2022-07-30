"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const errors_1 = require("../../../src/errors");
const createSqlTag_1 = require("../../../src/factories/createSqlTag");
const createPool_1 = require("../../helpers/createPool");
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('returns value of the first column from the first row', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.returns({
        rows: [
            {
                foo: 1,
            },
        ],
    });
    const result = await pool.oneFirst(sql `SELECT 1`);
    t.is(result, 1);
});
(0, ava_1.default)('throws an error if no rows are returned', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.returns({
        rows: [],
    });
    const error = await t.throwsAsync(pool.oneFirst(sql `SELECT 1`));
    t.true(error instanceof errors_1.NotFoundError);
});
(0, ava_1.default)('throws an error if more than one row is returned', async (t) => {
    const pool = (0, createPool_1.createPool)();
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
    const error = await t.throwsAsync(pool.oneFirst(sql `SELECT 1`));
    t.true(error instanceof errors_1.DataIntegrityError);
});
(0, ava_1.default)('throws an error if more than one column is returned', async (t) => {
    const pool = (0, createPool_1.createPool)();
    pool.querySpy.returns({
        rows: [
            {
                bar: 1,
                foo: 1,
            },
        ],
    });
    const error = await t.throwsAsync(pool.oneFirst(sql `SELECT 1`));
    t.true(error instanceof errors_1.UnexpectedStateError);
});
