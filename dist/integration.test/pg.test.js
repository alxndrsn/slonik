"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const createIntegrationTests_1 = require("../helpers/createIntegrationTests");
const pg_1 = require("pg");
const { test } = (0, createIntegrationTests_1.createTestRunner)(pg_1.Pool, 'pg');
(0, createIntegrationTests_1.createIntegrationTests)(test, pg_1.Pool);
test('returns expected query result object (NOTICE)', async (t) => {
    const pool = await (0, __1.createPool)(t.context.dsn, {
        PgPool: pg_1.Pool,
    });
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
      RAISE LOG '4. TEST LOG [%]',v_test;
      RAISE NOTICE '5. TEST NOTICE [%]',v_test;

      RETURN TRUE;
    END;
    $$;
  `);
    const result = await pool.query(__1.sql.unsafe `SELECT * FROM test_notice(${10});`);
    t.is(result.notices.length, 4);
    await pool.end();
});
//# sourceMappingURL=pg.test.js.map