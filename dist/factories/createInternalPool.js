"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInternalPool = void 0;
const Logger_1 = require("../Logger");
const state_1 = require("../state");
const createUid_1 = require("../utilities/createUid");
const serialize_error_1 = require("serialize-error");
const createInternalPool = (Pool, poolConfiguration) => {
    const poolId = (0, createUid_1.createUid)();
    const poolLog = Logger_1.Logger.child({
        poolId,
    });
    const pool = new Pool({
        ...poolConfiguration,
    });
    // https://github.com/gajus/slonik/issues/471
    pool.on('error', (error) => {
        poolLog.error({
            error: (0, serialize_error_1.serializeError)(error),
        }, 'client error');
    });
    state_1.poolStateMap.set(pool, {
        ended: false,
        mock: false,
        poolId,
        typeOverrides: null,
    });
    // istanbul ignore next
    pool.on('connect', (client) => {
        client.on('error', (error) => {
            poolLog.error({
                error: (0, serialize_error_1.serializeError)(error),
            }, 'client error');
        });
        client.on('notice', (notice) => {
            poolLog.info({
                notice: {
                    level: notice.name,
                    message: notice.message,
                },
            }, 'notice message');
        });
        poolLog.debug({
            stats: {
                idleConnectionCount: pool.idleCount,
                totalConnectionCount: pool.totalCount,
                waitingRequestCount: pool.waitingCount,
            },
        }, 'created a new client connection');
    });
    // istanbul ignore next
    pool.on('acquire', () => {
        poolLog.debug({
            stats: {
                idleConnectionCount: pool.idleCount,
                totalConnectionCount: pool.totalCount,
                waitingRequestCount: pool.waitingCount,
            },
        }, 'client is checked out from the pool');
    });
    // istanbul ignore next
    pool.on('remove', () => {
        poolLog.debug({
            stats: {
                idleConnectionCount: pool.idleCount,
                totalConnectionCount: pool.totalCount,
                waitingRequestCount: pool.waitingCount,
            },
        }, 'client connection is closed and removed from the client pool');
    });
    return pool;
};
exports.createInternalPool = createInternalPool;
//# sourceMappingURL=createInternalPool.js.map