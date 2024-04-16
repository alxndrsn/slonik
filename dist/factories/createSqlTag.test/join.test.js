"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../tokens");
const createSqlTag_1 = require("../createSqlTag");
const ava_1 = __importDefault(require("ava"));
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('creates a list of values', (t) => {
    const query = sql.fragment `SELECT (${sql.join([1, 2, 3], sql.fragment `, `)})`;
    t.deepEqual(query, {
        strings: ['SELECT (', ', ', ', ', ')'],
        type: tokens_1.FragmentToken,
        values: [1, 2, 3],
    });
});
(0, ava_1.default)('creates a list of values using glue', (t) => {
    const query = sql.fragment `SELECT ${sql.join([sql.fragment `TRUE`, sql.fragment `TRUE`], sql.fragment ` AND `)}`;
    t.deepEqual(query, {
        strings: ['SELECT TRUE AND TRUE'],
        type: tokens_1.FragmentToken,
        values: [],
    });
});
(0, ava_1.default)('interpolates SQL tokens', (t) => {
    const query = sql.fragment `SELECT (${sql.join([1, sql.fragment `foo`, 3], sql.fragment `, `)})`;
    t.deepEqual(query, {
        strings: ['SELECT (', ', foo, ', ')'],
        type: tokens_1.FragmentToken,
        values: [1, 3],
    });
});
(0, ava_1.default)('interpolates SQL tokens with bound values', (t) => {
    const query = sql.fragment `SELECT ${sql.join([1, sql.fragment `to_timestamp(${2}), ${3}`, 4], sql.fragment `, `)}`;
    t.deepEqual(query, {
        strings: ['SELECT ', ', to_timestamp(', '), ', ', ', ''],
        type: tokens_1.FragmentToken,
        values: [1, 2, 3, 4],
    });
});
(0, ava_1.default)('offsets positional parameter indexes', (t) => {
    const query = sql.fragment `SELECT ${1}, ${sql.join([1, sql.fragment `to_timestamp(${2}), ${3}`, 4], sql.fragment `, `)}, ${3}`;
    t.deepEqual(query, {
        strings: ['SELECT ', ', ', ', to_timestamp(', '), ', ', ', ', ', ''],
        type: tokens_1.FragmentToken,
        values: [1, 1, 2, 3, 4, 3],
    });
});
(0, ava_1.default)('supports bigint', (t) => {
    const query = sql.fragment `SELECT ${1n}, ${sql.join([sql.fragment `to_timestamp(${2n})`, 3n], sql.fragment `, `)}, ${4n}`;
    t.deepEqual(query, {
        strings: ['SELECT ', ', to_timestamp(', '), ', ', ', ''],
        type: tokens_1.FragmentToken,
        values: [1n, 2n, 3n, 4n],
    });
});
(0, ava_1.default)('nests expressions', (t) => {
    const query = sql.fragment `SELECT ${sql.join([
        sql.fragment `(${sql.join([1, 2], sql.fragment `, `)})`,
        sql.fragment `(${sql.join([3, 4], sql.fragment `, `)})`,
    ], sql.fragment `, `)}`;
    t.deepEqual(query, {
        strings: ['SELECT (', ', ', '), (', ', ', ')'],
        type: tokens_1.FragmentToken,
        values: [1, 2, 3, 4],
    });
});
(0, ava_1.default)('binary join expressions', (t) => {
    const data = Buffer.from('1f', 'hex');
    const query = sql.fragment `SELECT (${sql.join(['a', sql.binary(data)], sql.fragment `, `)})`;
    t.deepEqual(query, {
        strings: ['SELECT (', ', ', ')'],
        type: tokens_1.FragmentToken,
        values: ['a', data],
    });
});
(0, ava_1.default)('throws is member is not a SQL token or a primitive value expression', (t) => {
    const error = t.throws(() => {
        sql.fragment `${sql.join([
            // @ts-expect-error - intentional
            () => { },
        ], sql.fragment `, `)}`;
    });
    t.is(error?.message, 'Invalid list member type. Must be a SQL token or a primitive value expression.');
});
//# sourceMappingURL=join.test.js.map