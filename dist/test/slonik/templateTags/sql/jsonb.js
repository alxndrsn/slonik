"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const createSqlTag_1 = require("../../../../src/factories/createSqlTag");
const tokens_1 = require("../../../../src/tokens");
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('creates a value list (object)', (t) => {
    const query = sql `SELECT ${sql.jsonb({
        foo: 'bar',
    })}`;
    t.deepEqual(query, {
        sql: 'SELECT $1::jsonb',
        type: tokens_1.SqlToken,
        values: [
            '{"foo":"bar"}',
        ],
    });
});
(0, ava_1.default)('creates a value list (array)', (t) => {
    const query = sql `SELECT ${sql.jsonb([
        {
            foo: 'bar',
        },
    ])}`;
    t.deepEqual(query, {
        sql: 'SELECT $1::jsonb',
        type: tokens_1.SqlToken,
        values: [
            '[{"foo":"bar"}]',
        ],
    });
});
(0, ava_1.default)('stringifies NULL to \'null\'::jsonb', (t) => {
    const query = sql `SELECT ${sql.jsonb(null)}`;
    t.deepEqual(query, {
        sql: 'SELECT $1::jsonb',
        type: tokens_1.SqlToken,
        values: [
            'null',
        ],
    });
});
(0, ava_1.default)('JSON encodes string values', (t) => {
    const query = sql `SELECT ${sql.jsonb('example string')}`;
    t.deepEqual(query, {
        sql: 'SELECT $1::jsonb',
        type: tokens_1.SqlToken,
        values: [
            '"example string"',
        ],
    });
});
(0, ava_1.default)('JSON encodes numeric values', (t) => {
    const query = sql `SELECT ${sql.jsonb(1234)}`;
    t.deepEqual(query, {
        sql: 'SELECT $1::jsonb',
        type: tokens_1.SqlToken,
        values: [
            '1234',
        ],
    });
});
(0, ava_1.default)('JSON encodes boolean values', (t) => {
    const query = sql `SELECT ${sql.jsonb(true)}`;
    t.deepEqual(query, {
        sql: 'SELECT $1::jsonb',
        type: tokens_1.SqlToken,
        values: [
            'true',
        ],
    });
});
(0, ava_1.default)('throws if payload is undefined', (t) => {
    const error = t.throws(() => {
        // @ts-expect-error
        sql `SELECT ${sql.jsonb(undefined)}`;
    });
    t.is(error === null || error === void 0 ? void 0 : error.message, 'JSON payload must not be undefined.');
});
(0, ava_1.default)('throws if payload cannot be stringified (non-primitive object)', (t) => {
    const error = t.throws(() => {
        // @ts-expect-error
        sql `SELECT ${sql.jsonb(() => { })}`;
    });
    t.is(error === null || error === void 0 ? void 0 : error.message, 'JSON payload must be a primitive value or a plain object.');
});
(0, ava_1.default)('Object types with optional properties are allowed', (t) => {
    const testValue = {
        foo: 'bar',
    };
    const query = sql `SELECT ${sql.jsonb(testValue)}`;
    t.deepEqual(query, {
        sql: 'SELECT $1::jsonb',
        type: tokens_1.SqlToken,
        values: [
            '{"foo":"bar"}',
        ],
    });
});
