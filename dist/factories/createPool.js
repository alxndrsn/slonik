"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPool = void 0;
const bindPool_1 = require("../binders/bindPool");
const Logger_1 = require("../Logger");
const createTypeOverrides_1 = require("../routines/createTypeOverrides");
const state_1 = require("../state");
const createClientConfiguration_1 = require("./createClientConfiguration");
const createInternalPool_1 = require("./createInternalPool");
const createPoolConfiguration_1 = require("./createPoolConfiguration");
const pg_1 = require("pg");
/**
 * @param connectionUri PostgreSQL [Connection URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
 */
const createPool = async (connectionUri, clientConfigurationInput) => {
    const clientConfiguration = (0, createClientConfiguration_1.createClientConfiguration)(clientConfigurationInput);
    const poolConfiguration = (0, createPoolConfiguration_1.createPoolConfiguration)(connectionUri, clientConfiguration);
    let Pool = clientConfiguration.PgPool;
    if (!Pool) {
        Pool = pg_1.Pool;
    }
    if (!Pool) {
        throw new Error('Unexpected state.');
    }
    const setupPool = (0, createInternalPool_1.createInternalPool)(Pool, poolConfiguration);
    let getTypeParser;
    try {
        const connection = await setupPool.connect();
        getTypeParser = await (0, createTypeOverrides_1.createTypeOverrides)(connection, clientConfiguration.typeParsers);
        await connection.release();
    }
    finally {
        await setupPool.end();
    }
    const pool = (0, createInternalPool_1.createInternalPool)(Pool, {
        ...poolConfiguration,
        types: {
            getTypeParser,
        },
    });
    return (0, bindPool_1.bindPool)(Logger_1.Logger.child({
        poolId: (0, state_1.getPoolState)(pool).poolId,
    }), pool, clientConfiguration);
};
exports.createPool = createPool;
//# sourceMappingURL=createPool.js.map