"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../tokens");
const createSqlTag_1 = require("../createSqlTag");
const ava_1 = __importDefault(require("ava"));
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('binds an empty array', (t) => {
    const query = sql.fragment `SELECT ${sql.array([], 'int4')}`;
    t.deepEqual(query, {
        strings: ['SELECT ', '::"int4"[]'],
        type: tokens_1.FragmentToken,
        values: [[]],
    });
});
(0, ava_1.default)('binds bigint', (t) => {
    const query = sql.fragment `SELECT ${sql.array(
    // eslint-disable-next-line unicorn/numeric-separators-style
    [9007199254740999n], 'int8')}`;
    t.deepEqual(query, {
        strings: ['SELECT ', '::"int8"[]'],
        type: tokens_1.FragmentToken,
        // eslint-disable-next-line unicorn/numeric-separators-style
        values: [[BigInt(9007199254740999n)]],
    });
});
(0, ava_1.default)('binds an array with multiple values', (t) => {
    const query = sql.fragment `SELECT ${sql.array([1, 2, 3], 'int4')}`;
    t.deepEqual(query, {
        strings: ['SELECT ', '::"int4"[]'],
        type: tokens_1.FragmentToken,
        values: [[1, 2, 3]],
    });
});
(0, ava_1.default)('binds an array with bytea values', (t) => {
    const query = sql.fragment `SELECT ${sql.array([Buffer.from('foo')], 'bytea')}`;
    t.deepEqual(query, {
        strings: ['SELECT ', '::"bytea"[]'],
        type: tokens_1.FragmentToken,
        values: [[Buffer.from('foo')]],
    });
});
(0, ava_1.default)('offsets positional parameter indexes', (t) => {
    const query = sql.fragment `SELECT ${1}, ${sql.array([1, 2, 3], 'int4')}, ${3}`;
    t.deepEqual(query, {
        strings: ['SELECT ', ', ', '::"int4"[], ', ''],
        type: tokens_1.FragmentToken,
        values: [1, [1, 2, 3], 3],
    });
});
(0, ava_1.default)('binds a SQL token', (t) => {
    const query = sql.fragment `SELECT ${sql.array([1, 2, 3], sql.fragment `int[]`)}`;
    t.deepEqual(query, {
        strings: ['SELECT ', '::int[]'],
        type: tokens_1.FragmentToken,
        values: [[1, 2, 3]],
    });
});
(0, ava_1.default)('throws if array member is not a primitive value expression', (t) => {
    const error = t.throws(() => {
        sql.fragment `SELECT ${sql.array([
            // @ts-expect-error - intentional
            () => { },
        ], 'int')}`;
    });
    t.is(error?.message, 'Invalid array member type. Must be a primitive value expression.');
});
(0, ava_1.default)('throws if memberType is not a string or SqlToken of different type than "SLONIK_TOKEN_FRAGMENT"', (t) => {
    const error = t.throws(() => {
        sql.fragment `SELECT ${sql.array([1, 2, 3], sql.identifier(['int']))}`;
    });
    t.is(error?.message, 'Unsupported `memberType`. `memberType` must be a string or SqlToken of "SLONIK_TOKEN_FRAGMENT" type.');
});
//# sourceMappingURL=array.test.js.map