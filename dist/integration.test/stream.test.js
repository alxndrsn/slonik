"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const createIntegrationTests_1 = require("../helpers/createIntegrationTests");
const pg_1 = require("pg");
const sinon = __importStar(require("sinon"));
const zod_1 = require("zod");
const { test } = (0, createIntegrationTests_1.createTestRunner)(pg_1.Pool, 'pg');
test('reading stream after a delay', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn, {
        statementTimeout: 1000,
    });
    const onData = sinon.spy();
    await t.notThrowsAsync(pool.stream(__1.sql.unsafe `
      SELECT *
      FROM GENERATE_SERIES(1, 1000)
    `, (stream) => {
        setTimeout(() => {
            stream.on('data', onData);
        }, 500);
    }));
    t.true(onData.called);
    await pool.end();
});
test('untapped stream produces statement timeout', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn, {
        statementTimeout: 100,
    });
    const onData = sinon.spy();
    const error = await t.throwsAsync(pool.stream(__1.sql.unsafe `
      SELECT *
      FROM GENERATE_SERIES(1, 1000)
    `, (stream) => {
        setTimeout(() => {
            stream.on('data', onData);
        }, 500);
    }));
    t.true(error instanceof __1.StatementTimeoutError);
    t.true(onData.callCount < 1000);
    await pool.end();
});
test('stream pool connection can be re-used after an error', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn, {
        maximumPoolSize: 1,
        statementTimeout: 100,
    });
    const onData = sinon.spy();
    const error = await t.throwsAsync(pool.stream(__1.sql.unsafe `
      SELECT *
      FROM GENERATE_SERIES(1, 1000)
    `, (stream) => {
        setTimeout(() => {
            stream.on('data', onData);
        }, 500);
    }));
    t.true(error instanceof __1.StatementTimeoutError);
    t.true(onData.callCount < 1000);
    t.is(await pool.oneFirst(__1.sql.unsafe `SELECT 1`), 1);
    await pool.end();
});
test('streams rows', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn);
    await pool.query(__1.sql.unsafe `
    INSERT INTO person (name)
    VALUES ('foo'), ('bar'), ('baz')
  `);
    const messages = [];
    await pool.stream(__1.sql.type(zod_1.z.object({
        name: zod_1.z.string(),
    })) `
      SELECT name
      FROM person
    `, (stream) => {
        stream.on('data', (datum) => {
            messages.push(datum);
        });
    });
    t.deepEqual(messages, [
        {
            data: {
                name: 'foo',
            },
            fields: [
                {
                    dataTypeId: 25,
                    name: 'name',
                },
            ],
        },
        {
            data: {
                name: 'bar',
            },
            fields: [
                {
                    dataTypeId: 25,
                    name: 'name',
                },
            ],
        },
        {
            data: {
                name: 'baz',
            },
            fields: [
                {
                    dataTypeId: 25,
                    name: 'name',
                },
            ],
        },
    ]);
    await pool.end();
});
test('streams rows (check types)', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn);
    await pool.query(__1.sql.unsafe `
    INSERT INTO person (name)
    VALUES ('foo'), ('bar'), ('baz')
  `);
    const names = [];
    await pool.stream(__1.sql.type(zod_1.z.object({
        name: zod_1.z.string(),
    })) `
      SELECT name
      FROM person
    `, (stream) => {
        stream.on('data', (datum) => {
            // This test was added because earlier types did not accurately reflect stream outputs.
            // By accessing a property of the stream result we ensure that the stream outputs match the types.
            names.push(datum.data.name);
        });
    });
    t.deepEqual(names, ['foo', 'bar', 'baz']);
    await pool.end();
});
test('streams rows using AsyncIterator', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn);
    await pool.query(__1.sql.unsafe `
    INSERT INTO person (name)
    VALUES ('foo'), ('bar'), ('baz')
  `);
    const names = [];
    await pool.stream(__1.sql.type(zod_1.z.object({
        name: zod_1.z.string(),
    })) `
      SELECT name
      FROM person
    `, async (stream) => {
        for await (const row of stream) {
            names.push(row.data.name);
        }
    });
    t.deepEqual(names, ['foo', 'bar', 'baz']);
    await pool.end();
});
test('reading stream using custom type parsers', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn, {
        typeParsers: [(0, __1.createBigintTypeParser)()],
    });
    await pool.query(__1.sql.unsafe `
    INSERT INTO person (name, molecules)
    VALUES 
      ('foo', ${BigInt('6022000000000000000')}),
      ('bar', ${BigInt('6022000000000000001')}),
      ('baz', ${BigInt('6022000000000000002')})
  `);
    const persons = [];
    await pool.stream(__1.sql.type(zod_1.z.object({
        molecules: zod_1.z.bigint(),
    })) `
      SELECT molecules
      FROM person
    `, (stream) => {
        stream.on('data', (datum) => {
            persons.push(datum.data.molecules);
        });
    });
    t.deepEqual(persons, [
        BigInt('6022000000000000000'),
        BigInt('6022000000000000001'),
        BigInt('6022000000000000002'),
    ]);
    await pool.end();
});
test('reading stream using row transform interceptors (sync)', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn, {
        interceptors: [
            {
                transformRow: (context, query, row) => {
                    return {
                        ...row,
                        // @ts-expect-error - we know it exists
                        name: row.name.toUpperCase(),
                    };
                },
            },
        ],
    });
    await pool.query(__1.sql.unsafe `
    INSERT INTO person (name)
    VALUES ('foo'), ('bar'), ('baz')
  `);
    const names = [];
    await pool.stream(__1.sql.type(zod_1.z.object({
        name: zod_1.z.string(),
    })) `
      SELECT name
      FROM person
    `, (stream) => {
        stream.on('data', (datum) => {
            names.push(datum.data.name);
        });
    });
    t.deepEqual(names, ['FOO', 'BAR', 'BAZ']);
    await pool.end();
});
test('reading stream using row transform interceptors (async)', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn, {
        interceptors: [
            {
                transformRow: (context, query, row) => {
                    return Promise.resolve({
                        ...row,
                        // @ts-expect-error - we know it exists
                        name: row.name.toUpperCase(),
                    });
                },
            },
        ],
    });
    await pool.query(__1.sql.unsafe `
    INSERT INTO person (name)
    VALUES ('foo'), ('bar'), ('baz')
  `);
    const names = [];
    await pool.stream(__1.sql.type(zod_1.z.object({
        name: zod_1.z.string(),
    })) `
      SELECT name
      FROM person
    `, (stream) => {
        stream.on('data', (datum) => {
            names.push(datum.data.name);
        });
    });
    t.deepEqual(names, ['FOO', 'BAR', 'BAZ']);
    await pool.end();
});
test('streams include notices', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn);
    await pool.query(__1.sql.unsafe `
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

      RETURN TRUE;
    END;
    $$;
    `);
    const result = await pool.stream(__1.sql.unsafe `
      SELECT *
      FROM test_notice(${10})
    `, (stream) => {
        stream.on('data', () => { });
    });
    t.true(result.notices.length === 3);
    await pool.end();
});
test('streams rows with different batchSize', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn);
    await pool.query(__1.sql.unsafe `
    INSERT INTO person (name) VALUES ('foo'), ('bar'), ('baz')
  `);
    const messages = [];
    await pool.stream(__1.sql.unsafe `
    SELECT name
    FROM person
  `, (stream) => {
        stream.on('data', (datum) => {
            messages.push(datum);
        });
    }, {
        batchSize: 1,
    });
    t.deepEqual(messages, [
        {
            data: {
                name: 'foo',
            },
            fields: [
                {
                    dataTypeId: 25,
                    name: 'name',
                },
            ],
        },
        {
            data: {
                name: 'bar',
            },
            fields: [
                {
                    dataTypeId: 25,
                    name: 'name',
                },
            ],
        },
        {
            data: {
                name: 'baz',
            },
            fields: [
                {
                    dataTypeId: 25,
                    name: 'name',
                },
            ],
        },
    ]);
    await pool.end();
});
test('applies type parsers to streamed rows', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn, {
        typeParsers: [
            {
                name: 'date',
                parse: (value) => {
                    return value === null
                        ? value
                        : new Date(value + ' 00:00').getFullYear();
                },
            },
        ],
    });
    await pool.query(__1.sql.unsafe `
    INSERT INTO person
      (name, birth_date)
    VALUES
      ('foo', '1990-01-01'),
      ('bar', '1991-01-01'),
      ('baz', '1992-01-01')
  `);
    const messages = [];
    await pool.stream(__1.sql.unsafe `
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
            data: {
                birth_date: 1990,
            },
            fields: [
                {
                    dataTypeId: 1082,
                    name: 'birth_date',
                },
            ],
        },
        {
            data: {
                birth_date: 1991,
            },
            fields: [
                {
                    dataTypeId: 1082,
                    name: 'birth_date',
                },
            ],
        },
        {
            data: {
                birth_date: 1992,
            },
            fields: [
                {
                    dataTypeId: 1082,
                    name: 'birth_date',
                },
            ],
        },
    ]);
    await pool.end();
});
test('streams over a transaction', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn);
    await pool.query(__1.sql.unsafe `
    INSERT INTO person (name)
    VALUES ('foo'), ('bar'), ('baz')
  `);
    const messages = [];
    await pool.transaction(async (transaction) => {
        await transaction.stream(__1.sql.unsafe `
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
            data: {
                name: 'foo',
            },
            fields: [
                {
                    dataTypeId: 25,
                    name: 'name',
                },
            ],
        },
        {
            data: {
                name: 'bar',
            },
            fields: [
                {
                    dataTypeId: 25,
                    name: 'name',
                },
            ],
        },
        {
            data: {
                name: 'baz',
            },
            fields: [
                {
                    dataTypeId: 25,
                    name: 'name',
                },
            ],
        },
    ]);
    await pool.end();
});
test('frees connection after destroying a stream', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn);
    await t.throwsAsync(pool.stream(__1.sql.unsafe `
    SELECT * FROM GENERATE_SERIES(1, 100)
  `, (stream) => {
        stream.destroy();
    }));
    t.deepEqual(await pool.anyFirst(__1.sql.unsafe `
    SELECT TRUE
  `), [true]);
    await pool.end();
});
test('frees connection after destroying a stream with an error', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn);
    const error = await t.throwsAsync(pool.stream(__1.sql.unsafe `
    SELECT * FROM GENERATE_SERIES(1, 100)
  `, (stream) => {
        stream.destroy(new Error('Foo'));
    }));
    t.is(error?.message, 'Foo');
    t.deepEqual(await pool.anyFirst(__1.sql.unsafe `
    SELECT TRUE
  `), [true]);
    await pool.end();
});
test('stream throws error on syntax errors', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn);
    const error = await t.throwsAsync(pool.stream(__1.sql.unsafe `
        INVALID SYNTAX
      `, (stream) => {
        stream.on('data', () => { });
    }));
    t.true(error instanceof Error);
    t.deepEqual(error?.message, 'syntax error at or near "INVALID"');
    await pool.end();
});
//# sourceMappingURL=stream.test.js.map