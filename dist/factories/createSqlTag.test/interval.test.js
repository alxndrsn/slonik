"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../tokens");
const createSqlTag_1 = require("../createSqlTag");
const ava_1 = __importDefault(require("ava"));
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('creates an empty make_interval invocation', (t) => {
    const query = sql.fragment `SELECT ${sql.interval({})}`;
    t.deepEqual(query, {
        strings: ['SELECT make_interval()'],
        type: tokens_1.FragmentToken,
        values: [],
    });
});
(0, ava_1.default)('creates an interval', (t) => {
    const query = sql.fragment `SELECT ${sql.interval({
        days: 4,
        hours: 5,
        minutes: 6,
        months: 2,
        seconds: 7,
        weeks: 3,
        years: 1,
    })}`;
    t.deepEqual(query, {
        strings: [
            'SELECT make_interval(years => ',
            ', months => ',
            ', weeks => ',
            ', days => ',
            ', hours => ',
            ', mins => ',
            ', secs => ',
            ')',
        ],
        type: tokens_1.FragmentToken,
        values: [1, 2, 3, 4, 5, 6, 7],
    });
});
(0, ava_1.default)('throws if contains unknown properties', (t) => {
    const error = t.throws(() => {
        sql.fragment `SELECT ${sql.interval({
            // @ts-expect-error - intentional
            foo: 'bar',
        })}`;
    });
    t.is(error?.message, 'Interval input must not contain unknown properties.');
});
//# sourceMappingURL=interval.test.js.map