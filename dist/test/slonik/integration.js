"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importStar(require("ava"));
const delay_1 = __importDefault(require("delay"));
const src_1 = require("../../src");
const test = ava_1.default;
const beforeEach = ava_1.beforeEach;
const afterEach = ava_1.afterEach;
let pgNativeBindingsAreAvailable;
try {
    /* eslint-disable @typescript-eslint/no-require-imports, import/no-unassigned-import */
    require('pg-native');
    /* eslint-enable */
    pgNativeBindingsAreAvailable = true;
}
catch (_a) {
    pgNativeBindingsAreAvailable = false;
}
let testId = 0;
beforeEach(async (t) => {
    ++testId;
    const TEST_DATABASE_NAME = 'slonik_test_' + testId;
    t.context = {
        dsn: 'postgresql://postgres@localhost/' + TEST_DATABASE_NAME,
        testDatabaseName: TEST_DATABASE_NAME,
    };
    const pool0 = src_1.createPool('postgresql://postgres@localhost', {
        maximumPoolSize: 1,
    });
    await pool0.connect(async (connection) => {
        await connection.query(src_1.sql `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE
        pid != pg_backend_pid() AND
        datname = 'slonik_test'
    `);
        await connection.query(src_1.sql `DROP DATABASE IF EXISTS ${src_1.sql.identifier([TEST_DATABASE_NAME])}`);
        await connection.query(src_1.sql `CREATE DATABASE ${src_1.sql.identifier([TEST_DATABASE_NAME])}`);
    });
    await pool0.end();
    const pool1 = src_1.createPool(t.context.dsn, {
        maximumPoolSize: 1,
    });
    await pool1.connect(async (connection) => {
        await connection.query(src_1.sql `
      CREATE TABLE person (
        id SERIAL PRIMARY KEY,
        name text,
        birth_date date,
        payload bytea
      )
    `);
    });
    await pool1.end();
});
afterEach(async (t) => {
    const pool = src_1.createPool('postgresql://postgres@localhost', {
        maximumPoolSize: 1,
    });
    await pool.connect(async (connection) => {
        await connection.query(src_1.sql `
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE
        pid != pg_backend_pid() AND
        datname = 'slonik_test'
    `);
        await connection.query(src_1.sql `DROP DATABASE IF EXISTS ${src_1.sql.identifier([t.context.testDatabaseName])}`);
    });
    await pool.end();
});
test('returns expected query result object (SELECT)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    const result = await pool.query(src_1.sql `
    SELECT 1 "name"
  `);
    t.deepEqual(result, {
        command: 'SELECT',
        fields: [
            {
                dataTypeId: 23,
                name: 'name',
            },
        ],
        notices: [],
        rowCount: 1,
        rows: [
            {
                name: 1,
            },
        ],
    });
    await pool.end();
});
test('returns expected query result object (INSERT)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    const result = await pool.query(src_1.sql `
    INSERT INTO person
    (
      name
    )
    VALUES
    (
      'foo'
    )
    RETURNING
      name
  `);
    t.deepEqual(result, {
        command: 'INSERT',
        fields: [
            {
                dataTypeId: 25,
                name: 'name',
            },
        ],
        notices: [],
        rowCount: 1,
        rows: [
            {
                name: 'foo',
            },
        ],
    });
    await pool.end();
});
test('returns expected query result object (UPDATE)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    await pool.query(src_1.sql `
    INSERT INTO person
    (
      name
    )
    VALUES
    (
      'foo'
    )
    RETURNING
      name
  `);
    const result = await pool.query(src_1.sql `
    UPDATE person
    SET
      name = 'bar'
    WHERE name = 'foo'
    RETURNING
      name
  `);
    t.deepEqual(result, {
        command: 'UPDATE',
        fields: [
            {
                dataTypeId: 25,
                name: 'name',
            },
        ],
        notices: [],
        rowCount: 1,
        rows: [
            {
                name: 'bar',
            },
        ],
    });
    await pool.end();
});
test('returns expected query result object (DELETE)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    await pool.query(src_1.sql `
    INSERT INTO person
    (
      name
    )
    VALUES
    (
      'foo'
    )
    RETURNING
      name
  `);
    const result = await pool.query(src_1.sql `
    DELETE FROM person
    WHERE name = 'foo'
    RETURNING
      name
  `);
    t.deepEqual(result, {
        command: 'DELETE',
        fields: [
            {
                dataTypeId: 25,
                name: 'name',
            },
        ],
        notices: [],
        rowCount: 1,
        rows: [
            {
                name: 'foo',
            },
        ],
    });
    await pool.end();
});
test('terminated backend produces BackendTerminatedError error', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    const error = await t.throwsAsync(pool.connect(async (connection) => {
        const connectionPid = await connection.oneFirst(src_1.sql `
      SELECT pg_backend_pid()
    `);
        setTimeout(() => {
            pool.query(src_1.sql `SELECT pg_terminate_backend(${connectionPid})`);
        }, 100);
        await connection.query(src_1.sql `SELECT pg_sleep(2)`);
    }));
    t.true(error instanceof src_1.BackendTerminatedError);
    await pool.end();
});
test('cancelled statement produces StatementCancelledError error', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    const error = await t.throwsAsync(pool.connect(async (connection) => {
        const connectionPid = await connection.oneFirst(src_1.sql `
      SELECT pg_backend_pid()
    `);
        setTimeout(() => {
            pool.query(src_1.sql `SELECT pg_cancel_backend(${connectionPid})`);
        }, 100);
        await connection.query(src_1.sql `SELECT pg_sleep(2)`);
    }));
    t.true(error instanceof src_1.StatementCancelledError);
    await pool.end();
});
test('statement cancelled because of statement_timeout produces StatementTimeoutError error', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    const error = await t.throwsAsync(pool.connect(async (connection) => {
        await connection.query(src_1.sql `
      SET statement_timeout=100
    `);
        await connection.query(src_1.sql `SELECT pg_sleep(1)`);
    }));
    t.true(error instanceof src_1.StatementTimeoutError);
    await pool.end();
});
test('transaction terminated while in an idle state is rejected (at the next transaction query)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    await pool.connect(async (connection) => {
        await connection.query(src_1.sql `SET idle_in_transaction_session_timeout=500`);
        const error = await t.throwsAsync(connection.transaction(async (transaction) => {
            await delay_1.default(1000);
            await transaction.query(src_1.sql `SELECT 1`);
        }));
        t.true(error instanceof src_1.BackendTerminatedError);
    });
    await pool.end();
});
test('connection of transaction terminated while in an idle state is rejected (at the end of the transaction)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    await pool.connect(async (connection) => {
        await connection.query(src_1.sql `SET idle_in_transaction_session_timeout=500`);
        const error = await t.throwsAsync(connection.transaction(async () => {
            await delay_1.default(1000);
        }));
        t.true(error instanceof src_1.BackendTerminatedError);
    });
    await pool.end();
});
test('throws an error if an attempt is made to make multiple transactions at once using the same connection', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    const error = await t.throwsAsync(pool.connect(async (connection) => {
        await Promise.all([
            connection.transaction(async () => {
                await delay_1.default(1000);
            }),
            connection.transaction(async () => {
                await delay_1.default(1000);
            }),
            connection.transaction(async () => {
                await delay_1.default(1000);
            }),
        ]);
    }));
    t.true(error instanceof src_1.UnexpectedStateError);
    t.is(error.message, 'Cannot use the same connection to start a new transaction before completing the last transaction.');
    await pool.end();
});
test('writes and reads buffers', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    const payload = 'foobarbazqux';
    await pool.query(src_1.sql `
    INSERT INTO person
    (
      payload
    )
    VALUES
    (
      ${src_1.sql.binary(Buffer.from(payload))}
    )
  `);
    const result = await pool.oneFirst(src_1.sql `
    SELECT payload
    FROM person
  `);
    // eslint-disable-next-line @typescript-eslint/no-base-to-string
    t.is(result.toString(), payload);
    await pool.end();
});
if (pgNativeBindingsAreAvailable) {
    test('throws an error stream method is used', async (t) => {
        const pool = src_1.createPool(t.context.dsn);
        await pool.query(src_1.sql `
      INSERT INTO person (name) VALUES ('foo'), ('bar'), ('baz')
    `);
        await t.throwsAsync(pool.stream(src_1.sql `
        SELECT name
        FROM person
      `, () => { }), {
            message: 'Result cursors do not work with the native driver. Use JavaScript driver.',
        });
    });
}
else {
    test('streams rows', async (t) => {
        const pool = src_1.createPool(t.context.dsn);
        await pool.query(src_1.sql `
      INSERT INTO person (name) VALUES ('foo'), ('bar'), ('baz')
    `);
        const messages = [];
        await pool.stream(src_1.sql `
      SELECT name
      FROM person
    `, (stream) => {
            stream.on('data', (datum) => {
                messages.push(datum);
            });
        });
        t.deepEqual(messages, [
            {
                fields: [
                    {
                        dataTypeId: 25,
                        name: 'name',
                    },
                ],
                row: {
                    name: 'foo',
                },
            },
            {
                fields: [
                    {
                        dataTypeId: 25,
                        name: 'name',
                    },
                ],
                row: {
                    name: 'bar',
                },
            },
            {
                fields: [
                    {
                        dataTypeId: 25,
                        name: 'name',
                    },
                ],
                row: {
                    name: 'baz',
                },
            },
        ]);
        await pool.end();
    });
    test('applies type parsers to streamed rows', async (t) => {
        const pool = src_1.createPool(t.context.dsn, {
            typeParsers: [
                {
                    name: 'date',
                    parse: (value) => {
                        return value === null ? value : new Date(value + ' 00:00').getFullYear();
                    },
                },
            ],
        });
        await pool.query(src_1.sql `
      INSERT INTO person
        (name, birth_date)
      VALUES
        ('foo', '1990-01-01'),
        ('bar', '1991-01-01'),
        ('baz', '1992-01-01')
    `);
        const messages = [];
        await pool.stream(src_1.sql `
      SELECT birth_date
      FROM person
      ORDER BY birth_date ASC
    `, (stream) => {
            stream.on('data', (datum) => {
                messages.push(datum);
            });
        });
        t.deepEqual(messages, [
            {
                fields: [
                    {
                        dataTypeId: 1082,
                        name: 'birth_date',
                    },
                ],
                row: {
                    birth_date: 1990,
                },
            },
            {
                fields: [
                    {
                        dataTypeId: 1082,
                        name: 'birth_date',
                    },
                ],
                row: {
                    birth_date: 1991,
                },
            },
            {
                fields: [
                    {
                        dataTypeId: 1082,
                        name: 'birth_date',
                    },
                ],
                row: {
                    birth_date: 1992,
                },
            },
        ]);
        await pool.end();
    });
    test('streams over a transaction', async (t) => {
        const pool = src_1.createPool(t.context.dsn);
        await pool.query(src_1.sql `
      INSERT INTO person (name) VALUES ('foo'), ('bar'), ('baz')
    `);
        const messages = [];
        await pool.transaction(async (trxn) => {
            await trxn.stream(src_1.sql `
        SELECT name
        FROM person
      `, (stream) => {
                stream.on('data', (datum) => {
                    messages.push(datum);
                });
            });
        });
        t.deepEqual(messages, [
            {
                fields: [
                    {
                        dataTypeId: 25,
                        name: 'name',
                    },
                ],
                row: {
                    name: 'foo',
                },
            },
            {
                fields: [
                    {
                        dataTypeId: 25,
                        name: 'name',
                    },
                ],
                row: {
                    name: 'bar',
                },
            },
            {
                fields: [
                    {
                        dataTypeId: 25,
                        name: 'name',
                    },
                ],
                row: {
                    name: 'baz',
                },
            },
        ]);
        await pool.end();
    });
}
test('explicit connection configuration is persisted', async (t) => {
    const pool = src_1.createPool(t.context.dsn, {
        maximumPoolSize: 1,
    });
    await pool.connect(async (connection) => {
        const originalStatementTimeout = await connection.oneFirst(src_1.sql `SHOW statement_timeout`);
        t.not(originalStatementTimeout, '50ms');
        await connection.query(src_1.sql `SET statement_timeout=50`);
        const statementTimeout = await connection.oneFirst(src_1.sql `SHOW statement_timeout`);
        t.is(statementTimeout, '50ms');
    });
    await pool.end();
});
test('serves waiting requests', async (t) => {
    t.timeout(10000);
    const pool = src_1.createPool(t.context.dsn, {
        maximumPoolSize: 1,
    });
    let index = 100;
    const queue = [];
    while (index--) {
        queue.push(pool.query(src_1.sql `SELECT 1`));
    }
    await Promise.all(queue);
    await pool.end();
    // We are simply testing to ensure that requests in a queue
    // are assigned a connection after a preceding request is complete.
    t.true(true);
});
test('pool.end() resolves when there are no more connections (no connections at start)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: false,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
    await pool.end();
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: true,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
});
test('pool.end() resolves when there are no more connections (implicit connection)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: false,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
    await pool.query(src_1.sql `
    SELECT 1
  `);
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: false,
        idleConnectionCount: 1,
        waitingClientCount: 0,
    });
    await pool.end();
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: true,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
});
test('pool.end() resolves when there are no more connections (explicit connection holding pool alive)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: false,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
    pool.connect(async () => {
        await delay_1.default(500);
    });
    await delay_1.default(100);
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 1,
        ended: false,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
    await pool.end();
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: true,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
});
test('pool.end() resolves when there are no more connections (terminates idle connections)', async (t) => {
    t.timeout(1000);
    const pool = src_1.createPool(t.context.dsn, {
        idleTimeout: 5000,
        maximumPoolSize: 5,
    });
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: false,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
    await Promise.all([
        pool.query(src_1.sql `
      SELECT 1
    `),
        pool.query(src_1.sql `
      SELECT 1
    `),
        pool.query(src_1.sql `
      SELECT 1
    `),
        pool.query(src_1.sql `
      SELECT 1
    `),
        pool.query(src_1.sql `
      SELECT 1
    `),
    ]);
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: false,
        idleConnectionCount: 5,
        waitingClientCount: 0,
    });
    await pool.end();
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: true,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
});
test.skip('idle transactions are terminated after `idleInTransactionSessionTimeout`', async (t) => {
    t.timeout(10000);
    const pool = src_1.createPool(t.context.dsn, {
        idleInTransactionSessionTimeout: 1000,
        maximumPoolSize: 5,
    });
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: false,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
    const error = await t.throwsAsync(pool.transaction(async () => {
        await delay_1.default(2000);
    }));
    t.true(error instanceof src_1.BackendTerminatedError);
    await pool.end();
});
// Skipping test because of a bug in node-postgres.
// @see https://github.com/brianc/node-postgres/issues/2103
test.skip('statements are cancelled after `statementTimeout`', async (t) => {
    t.timeout(5000);
    const pool = src_1.createPool(t.context.dsn, {
        maximumPoolSize: 5,
        statementTimeout: 1000,
    });
    t.deepEqual(pool.getPoolState(), {
        activeConnectionCount: 0,
        ended: false,
        idleConnectionCount: 0,
        waitingClientCount: 0,
    });
    const error = await t.throwsAsync(pool.query(src_1.sql `SELECT pg_sleep(2000)`));
    t.true(error instanceof src_1.StatementTimeoutError);
    await pool.end();
});
test.serial('retries failing transactions (deadlock)', async (t) => {
    t.timeout(2000);
    const pool = src_1.createPool(t.context.dsn);
    const firstPersonId = await pool.oneFirst(src_1.sql `
    INSERT INTO person (name)
    VALUES ('foo')
    RETURNING id
  `);
    const secondPersonId = await pool.oneFirst(src_1.sql `
    INSERT INTO person (name)
    VALUES ('bar')
    RETURNING id
  `);
    let transactionCount = 0;
    let resolveDeadlock;
    const deadlock = new Promise((resolve) => {
        resolveDeadlock = resolve;
    });
    const updatePerson = async (firstUpdateId, firstUpdateName, secondUpdateId, secondUpdateName, delayDeadlock) => {
        await pool.transaction(async (transaction) => {
            await transaction.query(src_1.sql `
        SET deadlock_timeout='1s'
      `);
            await transaction.query(src_1.sql `
        UPDATE person
        SET name = ${firstUpdateName}
        WHERE id = ${firstUpdateId}
      `);
            ++transactionCount;
            if (transactionCount === 2) {
                resolveDeadlock();
            }
            await delay_1.default(delayDeadlock);
            await deadlock;
            await transaction.query(src_1.sql `
        UPDATE person
        SET name = ${secondUpdateName}
        WHERE id = ${secondUpdateId}
      `);
        });
    };
    await t.notThrowsAsync(Promise.all([
        updatePerson(firstPersonId, 'foo 0', secondPersonId, 'foo 1', 50),
        updatePerson(secondPersonId, 'bar 0', firstPersonId, 'bar 1', 0),
    ]));
    t.is(await pool.oneFirst(src_1.sql `
      SELECT name
      FROM person
      WHERE id = ${firstPersonId}
    `), 'bar 1');
    t.is(await pool.oneFirst(src_1.sql `
      SELECT name
      FROM person
      WHERE id = ${secondPersonId}
    `), 'bar 0');
    await pool.end();
});
test('does not throw an error if running a query with array_agg on dates', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    await pool.query(src_1.sql `
    INSERT INTO person
    (
      name,
      birth_date
    )
    VALUES
      ('foo', '2020-01-01'),
      ('foo', '2020-01-02'),
      ('bar', '2020-01-03')
  `);
    const result = await pool.query(src_1.sql `
    SELECT
      p1.name,
      array_agg(p1.birth_date) birth_dates
    FROM person p1
    GROUP BY p1.name
  `);
    t.deepEqual(result, {
        command: 'SELECT',
        fields: [
            {
                dataTypeId: 25,
                name: 'name',
            },
            {
                dataTypeId: 1182,
                name: 'birth_dates',
            },
        ],
        notices: [],
        rowCount: 2,
        rows: [
            {
                birth_dates: ['2020-01-03'],
                name: 'bar',
            },
            {
                birth_dates: ['2020-01-01', '2020-01-02'],
                name: 'foo',
            },
        ],
    });
    await pool.end();
});
test('returns true if returns rows', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    t.true(await pool.exists(src_1.sql `
      SELECT LIMIT 1
    `));
    await pool.end();
});
test('returns false if returns rows', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    t.false(await pool.exists(src_1.sql `
      SELECT LIMIT 0
    `));
    await pool.end();
});
test('returns expected query result object (NOTICE)', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    await pool.query(src_1.sql `
      CREATE OR REPLACE FUNCTION test_notice
        (
          v_test INTEGER
        ) RETURNS BOOLEAN
        LANGUAGE plpgsql
      AS
      $$
      BEGIN

        RAISE NOTICE '1. TEST NOTICE [%]',v_test;
        RAISE NOTICE '2. TEST NOTICE [%]',v_test;
        RAISE NOTICE '3. TEST NOTICE [%]',v_test;
        RAISE LOG '4. TEST LOG [%]',v_test;
        RAISE NOTICE '5. TEST NOTICE [%]',v_test;

        RETURN TRUE;
      END;
      $$;
  `);
    const result = await pool.query(src_1.sql `SELECT * FROM test_notice(${10});`);
    t.assert(result.notices.length === 4);
    await pool.end();
});
test('throw error with notices', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    await pool.query(src_1.sql `
      CREATE OR REPLACE FUNCTION error_notice
        (
          v_test INTEGER
        ) RETURNS BOOLEAN
        LANGUAGE plpgsql
      AS
      $$
      BEGIN

        RAISE NOTICE '1. TEST NOTICE [%]',v_test;
        RAISE NOTICE '2. TEST NOTICE [%]',v_test;
        RAISE NOTICE '3. TEST NOTICE [%]',v_test;
        RAISE WARNING '4. TEST LOG [%]',v_test;
        RAISE NOTICE '5. TEST NOTICE [%]',v_test;
        RAISE EXCEPTION 'THIS IS AN ERROR';
      END;
      $$;
  `);
    try {
        await pool.query(src_1.sql `SELECT * FROM error_notice(${10});`);
    }
    catch (error) {
        if (error === null || error === void 0 ? void 0 : error.notices) {
            t.assert(error.notices.length = 5);
        }
    }
    await pool.end();
});
test('error messages include original pg error', async (t) => {
    var _a;
    const pool = src_1.createPool(t.context.dsn);
    await pool.query(src_1.sql `
    INSERT INTO person (id)
    VALUES (1)
  `);
    const error = await t.throwsAsync(async () => {
        return pool.query(src_1.sql `
      INSERT INTO person (id)
      VALUES (1)
    `);
    });
    t.is(error.message, 
    // @ts-expect-error
    'Query violates a unique integrity constraint. ' + ((_a = error === null || error === void 0 ? void 0 : error.originalError) === null || _a === void 0 ? void 0 : _a.message));
    await pool.end();
});
test('frees connection after destroying a stream', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    await pool.stream(src_1.sql `
    SELECT * FROM GENERATE_SERIES(1, 100)
  `, (stream) => {
        stream.destroy();
    });
    t.deepEqual(await pool.anyFirst(src_1.sql `
    SELECT TRUE
  `), [
        true,
    ]);
    await pool.end();
});
test('does not crash after destroying a stream with an error', async (t) => {
    const pool = src_1.createPool(t.context.dsn);
    await pool.stream(src_1.sql `
    SELECT * FROM GENERATE_SERIES(1, 100)
  `, (stream) => {
        stream.destroy(new Error('Foo'));
    });
    t.deepEqual(await pool.anyFirst(src_1.sql `
    SELECT TRUE
  `), [
        true,
    ]);
    await pool.end();
});
//# sourceMappingURL=integration.js.map