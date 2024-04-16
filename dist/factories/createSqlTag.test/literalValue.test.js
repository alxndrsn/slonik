"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens_1 = require("../../tokens");
const createSqlTag_1 = require("../createSqlTag");
const ava_1 = __importDefault(require("ava"));
const sql = (0, createSqlTag_1.createSqlTag)();
(0, ava_1.default)('creates an object describing a query with an inlined literal value', (t) => {
    const query = sql.fragment `CREATE USER foo WITH PASSWORD ${sql.literalValue('bar')}`;
    t.deepEqual(query, {
        sql: "CREATE USER foo WITH PASSWORD 'bar'",
        type: tokens_1.FragmentToken,
        values: [],
    });
});
//# sourceMappingURL=literalValue.test.js.map