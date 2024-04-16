"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../tokens");
const createSqlTag_1 = require("../createSqlTag");
const ava_1 = __importDefault(require("ava"));
const roarr_1 = require("roarr");
const test = ava_1.default;
const sql = (0, createSqlTag_1.createSqlTag)();
test.beforeEach((t) => {
    t.context.logs = [];
    roarr_1.ROARR.write = (message) => {
        t.context.logs.push(JSON.parse(message));
    };
});
test('creates an object describing a query', (t) => {
    const query = sql.fragment `SELECT 1`;
    t.deepEqual(query, {
        strings: ['SELECT 1'],
        type: tokens_1.FragmentToken,
        values: [],
    });
});
test('creates an object describing query value bindings', (t) => {
    const query = sql.fragment `SELECT ${'foo'}`;
    t.deepEqual(query, {
        strings: ['SELECT ', ''],
        type: tokens_1.FragmentToken,
        values: ['foo'],
    });
});
test('creates an object describing query value bindings (multiple)', (t) => {
    const query = sql.fragment `SELECT ${'foo'}, ${'bar'}`;
    t.deepEqual(query, {
        strings: ['SELECT ', ', ', ''],
        type: tokens_1.FragmentToken,
        values: ['foo', 'bar'],
    });
});
test('nests sql templates', (t) => {
    const query0 = sql.fragment `SELECT ${'foo'} FROM bar`;
    const query1 = sql.fragment `SELECT ${'baz'} FROM (${query0})`;
    t.deepEqual(query1, {
        strings: ['SELECT ', ' FROM (SELECT ', ' FROM bar)'],
        type: tokens_1.FragmentToken,
        values: ['baz', 'foo'],
    });
});
test('copes with dollar-number in table name', (t) => {
    const query0 = sql.fragment `discounted_to_', ' (offer_id INTEGER)`;
    const query1 = sql.fragment `CREATE TABLE ${query0}`;
    t.deepEqual(query1, {
        sql: "CREATE TABLE discounted_to_', ' (offer_id INTEGER)",
        type: tokens_1.FragmentToken,
        values: [],
    });
});
test('copes with dollar-number in column name (CREATE TABLE)', (t) => {
    const query0 = sql.fragment `offers (discounted_to_', ' BOOLEAN)`;
    const query1 = sql.fragment `CREATE TABLE ${query0}`;
    t.deepEqual(query1, {
        sql: "CREATE TABLE offers (discounted_to_', ' BOOLEAN)",
        type: tokens_1.FragmentToken,
        values: [],
    });
});
test('copes with dollar-number in column name (SELECT)', (t) => {
    const query0 = sql.fragment `"discounted_to_', '" IS TRUE`;
    const query1 = sql.fragment `SELECT * FROM offers WHERE ${query0}`;
    t.deepEqual(query1, {
        strings: ['SELECT * FROM offers WHERE "discounted_to_', '" IS TRUE'],
        type: tokens_1.FragmentToken,
        values: [],
    });
});
test('copes with dollar-number in function definitions', (t) => {
    // example function from https://www.postgresql.org/docs/current/sql-createfunction.html
    const query0 = sql.fragment `add(integer, integer) RETURNS integer
      AS 'select ', ' + ', ';'
      LANGUAGE SQL
      IMMUTABLE
      RETURNS NULL ON NULL INPUT`;
    const query1 = sql.fragment `CREATE FUNCTION ${query0}`;
    t.deepEqual(query1, {
        sql: `CREATE FUNCTION add(integer, integer) RETURNS integer
      AS 'select ', ' + ', ';'
      LANGUAGE SQL
      IMMUTABLE
      RETURNS NULL ON NULL INPUT`,
        type: tokens_1.FragmentToken,
        values: [],
    });
});
test('throws if bound an undefined value', (t) => {
    const error = t.throws(() => {
        // @ts-expect-error - intentional
        sql.fragment `SELECT ${undefined}`;
    });
    t.is(error?.message, 'SQL tag cannot be bound to undefined value at index 1.');
});
test.serial.skip('logs all bound values if one is undefined', (t) => {
    t.throws(() => {
        // @ts-expect-error - intentional
        sql.fragment `SELECT ${undefined}`;
    });
    const targetMessage = t.context.logs.find((message) => {
        return message.message === 'bound values';
    });
    t.truthy(targetMessage);
    t.deepEqual(targetMessage.context.parts, ['SELECT ', '']);
});
test('the sql property is immutable', (t) => {
    const query = sql.fragment `SELECT 1`;
    t.throws(() => {
        // @ts-expect-error This is intentional.
        query.sql = 'SELECT 2';
    });
});
//# sourceMappingURL=sql.test.js.map