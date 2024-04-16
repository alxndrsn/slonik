"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createSqlTag_1 = require("../../factories/createSqlTag");
const createPool_1 = require("../../helpers/createPool");
const ava_1 = __importDefault(require("ava"));
const promises_1 = require("node:timers/promises");
const sql = (0, createSqlTag_1.createSqlTag)();
const getQueries = (spy) => {
    return spy.getCalls().map((call) => {
        return call.args[0];
    });
};
(0, ava_1.default)('commits successful transaction', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    await pool.connect(async (c1) => {
        return await c1.transaction(async (t1) => {
            return await t1.query(sql.unsafe `SELECT 1`);
        });
    });
    t.deepEqual(getQueries(pool.querySpy), [
        'START TRANSACTION',
        'SELECT 1',
        'COMMIT',
    ]);
});
(0, ava_1.default)('rollsback unsuccessful transaction', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    await t.throwsAsync(pool.connect(async (c1) => {
        await c1.transaction(async (t1) => {
            await t1.query(sql.unsafe `SELECT 1`);
            return await Promise.reject(new Error('foo'));
        });
    }));
    t.deepEqual(getQueries(pool.querySpy), [
        'START TRANSACTION',
        'SELECT 1',
        'ROLLBACK',
    ]);
});
(0, ava_1.default)('uses savepoints to nest transactions', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    await pool.connect(async (c1) => {
        await c1.transaction(async (t1) => {
            await t1.query(sql.unsafe `SELECT 1`);
            await t1.transaction(async (t2) => {
                return await t2.query(sql.unsafe `SELECT 2`);
            });
        });
    });
    t.deepEqual(getQueries(pool.querySpy), [
        'START TRANSACTION',
        'SELECT 1',
        'SAVEPOINT slonik_savepoint_1',
        'SELECT 2',
        'COMMIT',
    ]);
});
(0, ava_1.default)('rollsback to the last savepoint', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    await pool.connect(async (c1) => {
        await c1.transaction(async (t1) => {
            await t1.query(sql.unsafe `SELECT 1`);
            await t.throwsAsync(t1.transaction(async (t2) => {
                await t2.query(sql.unsafe `SELECT 2`);
                return await Promise.reject(new Error('foo'));
            }));
        });
    });
    t.deepEqual(getQueries(pool.querySpy), [
        'START TRANSACTION',
        'SELECT 1',
        'SAVEPOINT slonik_savepoint_1',
        'SELECT 2',
        'ROLLBACK TO SAVEPOINT slonik_savepoint_1',
        'COMMIT',
    ]);
});
(0, ava_1.default)('rollsback the entire transaction with multiple savepoints', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    await pool.connect(async (c1) => {
        return await t.throwsAsync(c1.transaction(async (t1) => {
            await t1.query(sql.unsafe `SELECT 1`);
            return await t1.transaction(async (t2) => {
                await t2.query(sql.unsafe `SELECT 2`);
                return await Promise.reject(new Error('foo'));
            });
        }));
    });
    t.deepEqual(getQueries(pool.querySpy), [
        'START TRANSACTION',
        'SELECT 1',
        'SAVEPOINT slonik_savepoint_1',
        'SELECT 2',
        'ROLLBACK TO SAVEPOINT slonik_savepoint_1',
        'ROLLBACK',
    ]);
});
(0, ava_1.default)('rollsback the entire transaction with multiple savepoints (multiple depth layers)', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    await pool.connect(async (c1) => {
        return await t.throwsAsync(c1.transaction(async (t1) => {
            await t1.query(sql.unsafe `SELECT 1`);
            return await t1.transaction(async (t2) => {
                await t2.query(sql.unsafe `SELECT 2`);
                return await t2.transaction(async (t3) => {
                    await t3.query(sql.unsafe `SELECT 3`);
                    return await Promise.reject(new Error('foo'));
                });
            });
        }));
    });
    t.deepEqual(getQueries(pool.querySpy), [
        'START TRANSACTION',
        'SELECT 1',
        'SAVEPOINT slonik_savepoint_1',
        'SELECT 2',
        'SAVEPOINT slonik_savepoint_2',
        'SELECT 3',
        'ROLLBACK TO SAVEPOINT slonik_savepoint_2',
        'ROLLBACK TO SAVEPOINT slonik_savepoint_1',
        'ROLLBACK',
    ]);
});
(0, ava_1.default)('throws an error if an attempt is made to create a new transaction before the last transaction is completed', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    const connection = pool.connect(async (c1) => {
        await Promise.race([
            c1.transaction(async () => {
                await (0, promises_1.setTimeout)(1000);
            }),
            c1.transaction(async () => {
                await (0, promises_1.setTimeout)(1000);
            }),
        ]);
    });
    const error = await t.throwsAsync(connection);
    t.is(error?.message, 'Cannot use the same connection to start a new transaction before completing the last transaction.');
});
(0, ava_1.default)('throws an error if an attempt is made to execute a query using the parent transaction before the current transaction is completed', async (t) => {
    const pool = await (0, createPool_1.createPool)();
    const connection = pool.connect(async (c1) => {
        return await c1.transaction(async (t1) => {
            return await t1.transaction(async () => {
                return await t1.query(sql.unsafe `SELECT 1`);
            });
        });
    });
    const error = await t.throwsAsync(connection);
    t.is(error?.message, 'Cannot run a query using parent transaction.');
});
//# sourceMappingURL=transaction.test.js.map