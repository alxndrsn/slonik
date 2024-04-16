"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../tokens");
const createSqlTag_1 = require("../createSqlTag");
const ava_1 = __importDefault(require("ava"));
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('creates an unnest expression using primitive values (type name identifier)', (t) => {
    const query = sql.fragment `SELECT * FROM ${sql.unnest([
        [1, 2, 3],
        [4, 5, 6],
    ], ['int4', 'int4', 'int4'])}`;
    t.deepEqual(query, {
        strings: [
            'SELECT * FROM unnest(',
            '::"int4"[], ',
            '::"int4"[], ',
            '::"int4"[])',
        ],
        type: tokens_1.FragmentToken,
        values: [
            [1, 4],
            [2, 5],
            [3, 6],
        ],
    });
});
(0, ava_1.default)('creates an unnest expression using primitive values (sql token)', (t) => {
    const query = sql.fragment `SELECT * FROM ${sql.unnest([
        [1, 2, 3],
        [4, 5, 6],
    ], [sql.fragment `integer`, sql.fragment `integer`, sql.fragment `integer`])}`;
    t.deepEqual(query, {
        strings: [
            'SELECT * FROM unnest(',
            '::integer[], ',
            '::integer[], ',
            '::integer[])',
        ],
        type: tokens_1.FragmentToken,
        values: [
            [1, 4],
            [2, 5],
            [3, 6],
        ],
    });
});
(0, ava_1.default)('treats type as sql.identifier', (t) => {
    const query = sql.fragment `SELECT bar, baz FROM ${sql.unnest([
        [1, 3],
        [2, 4],
    ], [
        ['foo', 'int4'],
        ['foo', 'int4'],
    ])} AS foo(bar, baz)`;
    t.deepEqual(query, {
        strings: [
            'SELECT bar, baz FROM unnest(',
            '::"foo"."int4"[], ',
            '::"foo"."int4"[]) AS foo(bar, baz)',
        ],
        type: tokens_1.FragmentToken,
        values: [
            [1, 2],
            [3, 4],
        ],
    });
});
(0, ava_1.default)('creates an unnest expression using arrays', (t) => {
    const query = sql.fragment `SELECT * FROM ${sql.unnest([
        [1, 2, 3],
        [4, 5, 6],
    ], ['int4', 'int4', 'int4'])}`;
    t.deepEqual(query, {
        strings: [
            'SELECT * FROM unnest(',
            '::"int4"[], ',
            '::"int4"[], ',
            '::"int4"[])',
        ],
        type: tokens_1.FragmentToken,
        values: [
            [1, 4],
            [2, 5],
            [3, 6],
        ],
    });
});
(0, ava_1.default)('creates incremental alias names if no alias names are provided', (t) => {
    const query = sql.fragment `SELECT * FROM ${sql.unnest([
        [1, 2, 3],
        [4, 5, 6],
    ], ['int4', 'int4', 'int4'])}`;
    t.deepEqual(query, {
        strings: [
            'SELECT * FROM unnest(',
            '::"int4"[], ',
            '::"int4"[], ',
            '::"int4"[])',
        ],
        type: tokens_1.FragmentToken,
        values: [
            [1, 4],
            [2, 5],
            [3, 6],
        ],
    });
});
(0, ava_1.default)('recognizes an array of arrays array', (t) => {
    const query = sql.fragment `SELECT * FROM ${sql.unnest([[[[1], [2], [3]]]], ['int4[]'])}`;
    t.deepEqual(query, {
        strings: ['SELECT * FROM unnest(', '::"int4"[][])'],
        type: tokens_1.FragmentToken,
        values: [[[[1], [2], [3]]]],
    });
});
(0, ava_1.default)('throws if tuple member is not a primitive value expression', (t) => {
    const error = t.throws(() => {
        sql.fragment `SELECT * FROM ${sql.unnest([
            [
                // @ts-expect-error Intentional invalid value.
                () => { },
                2,
                3,
            ],
            [4, 5],
        ], ['int4', 'int4', 'int4'])}`;
    });
    t.is(error?.message, 'Invalid unnest tuple member type. Must be a primitive value expression.');
});
(0, ava_1.default)('throws if tuple member length varies in a list of tuples', (t) => {
    const error = t.throws(() => {
        sql.fragment `SELECT * FROM ${sql.unnest([
            [1, 2, 3],
            [4, 5],
        ], ['int4', 'int4', 'int4'])}`;
    });
    t.is(error?.message, 'Each tuple in a list of tuples must have an equal number of members.');
});
(0, ava_1.default)('throws if tuple member length does not match column types length', (t) => {
    const error = t.throws(() => {
        sql.fragment `SELECT * FROM ${sql.unnest([
            [1, 2, 3],
            [4, 5, 6],
        ], ['int4', 'int4'])}`;
    });
    t.is(error?.message, 'Column types length must match tuple member length.');
});
//# sourceMappingURL=unnest.test.js.map