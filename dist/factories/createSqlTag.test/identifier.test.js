"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../tokens");
const createSqlTag_1 = require("../createSqlTag");
const ava_1 = __importDefault(require("ava"));
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('creates an object describing a query with inlined identifiers', (t) => {
    const query = sql.fragment `SELECT ${'foo'} FROM ${sql.identifier(['bar'])}`;
    t.deepEqual(query, {
        strings: ['SELECT ', ' FROM "bar"'],
        type: tokens_1.FragmentToken,
        values: ['foo'],
    });
});
(0, ava_1.default)('creates an object describing a query with inlined identifiers (specifier)', (t) => {
    const query = sql.fragment `SELECT ${'foo'} FROM ${sql.identifier([
        'bar',
        'baz',
    ])}`;
    t.deepEqual(query, {
        strings: ['SELECT ', ' FROM "bar"."baz"'],
        type: tokens_1.FragmentToken,
        values: ['foo'],
    });
});
(0, ava_1.default)('throws if an identifier name array member type is not a string', (t) => {
    const error = t.throws(() => {
        sql.fragment `${sql.identifier([
            // @ts-expect-error - intentional
            () => { },
        ])}`;
    });
    t.is(error?.message, 'Identifier name array member type must be a string.');
});
//# sourceMappingURL=identifier.test.js.map