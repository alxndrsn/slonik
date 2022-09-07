"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const createSqlTag_1 = require("../../../../../src/factories/createSqlTag");
const createPool_1 = require("../../../../helpers/createPool");
const sql = createSqlTag_1.createSqlTag();
ava_1.default('overrides result row', async (t) => {
    const pool = createPool_1.createPool({
        interceptors: [
            {
                transformRow: () => {
                    return {
                        foo: 2,
                    };
                },
            },
        ],
    });
    pool.querySpy.returns({
        command: 'SELECT',
        fields: [],
        rowCount: 1,
        rows: [
            {
                foo: 1,
            },
        ],
    });
    const result = await pool.query(sql `SELECT 1`);
    t.deepEqual(result, {
        command: 'SELECT',
        fields: [],
        notices: [],
        rowCount: 1,
        rows: [
            {
                foo: 2,
            },
        ],
    });
});
//# sourceMappingURL=transformRow.js.map