"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../tokens");
const createSqlTag_1 = require("../createSqlTag");
const ava_1 = __importDefault(require("ava"));
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('binds a date', (t) => {
    const query = sql.fragment `SELECT ${sql.date(new Date('2022-08-19T03:27:24.951Z'))}`;
    t.deepEqual(query, {
        strings: ['SELECT ', '::date'],
        type: tokens_1.FragmentToken,
        values: ['2022-08-19'],
    });
});
(0, ava_1.default)('throws if not instance of Date', (t) => {
    const error = t.throws(() => {
        // @ts-expect-error - intentional
        sql.fragment `SELECT ${sql.date(1)}`;
    });
    t.is(error?.message, 'Date parameter value must be an instance of Date.');
});
//# sourceMappingURL=date.test.js.map