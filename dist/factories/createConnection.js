"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConnection = void 0;
const bindPoolConnection_1 = require("../binders/bindPoolConnection");
const errors_1 = require("../errors");
const establishConnection_1 = require("../routines/establishConnection");
const state_1 = require("../state");
const terminatePoolConnection = (connection) => {
    // tells the pool to destroy this client
    connection.release(true);
};
const destroyBoundConnection = (boundConnection) => {
    const boundConnectionMethods = [
        'any',
        'anyFirst',
        'exists',
        'many',
        'manyFirst',
        'maybeOne',
        'maybeOneFirst',
        'one',
        'oneFirst',
        'query',
        'stream',
        'transaction',
    ];
    for (const boundConnectionMethod of boundConnectionMethods) {
        boundConnection[boundConnectionMethod] = async () => {
            throw new Error('Cannot use released connection');
        };
    }
};
const createConnection = async (parentLog, pool, clientConfiguration, connectionType, connectionHandler, poolHandler, query = null) => {
    const { ended, poolId } = (0, state_1.getPoolState)(pool);
    if (ended) {
        throw new errors_1.UnexpectedStateError('Connection pool shutdown has been already initiated. Cannot create a new connection.');
    }
    for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.beforePoolConnection) {
            const maybeNewPool = await interceptor.beforePoolConnection({
                log: parentLog,
                poolId,
                query,
            });
            if (maybeNewPool) {
                return await poolHandler(maybeNewPool);
            }
        }
    }
    const connection = await (0, establishConnection_1.establishConnection)(parentLog, pool, clientConfiguration.connectionRetryLimit);
    const { connectionId } = (0, state_1.getPoolClientState)(connection);
    const connectionLog = parentLog.child({
        connectionId,
    });
    const connectionContext = {
        connectionId,
        connectionType,
        log: connectionLog,
        poolId,
    };
    const boundConnection = (0, bindPoolConnection_1.bindPoolConnection)(connectionLog, connection, clientConfiguration);
    try {
        for (const interceptor of clientConfiguration.interceptors) {
            if (interceptor.afterPoolConnection) {
                await interceptor.afterPoolConnection(connectionContext, boundConnection);
            }
        }
    }
    catch (error) {
        terminatePoolConnection(connection);
        throw error;
    }
    let result;
    try {
        result = await connectionHandler(connectionLog, connection, boundConnection, clientConfiguration);
    }
    catch (error) {
        terminatePoolConnection(connection);
        throw error;
    }
    try {
        for (const interceptor of clientConfiguration.interceptors) {
            if (interceptor.beforePoolConnectionRelease) {
                await interceptor.beforePoolConnectionRelease(connectionContext, boundConnection);
            }
        }
    }
    catch (error) {
        terminatePoolConnection(connection);
        throw error;
    }
    destroyBoundConnection(boundConnection);
    connection.release();
    return result;
};
exports.createConnection = createConnection;
//# sourceMappingURL=createConnection.js.map