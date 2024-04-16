"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.establishConnection = void 0;
const errors_1 = require("../errors");
const state_1 = require("../state");
const createUid_1 = require("../utilities/createUid");
const serialize_error_1 = require("serialize-error");
const establishConnection = async (parentLog, pool, connectionRetryLimit) => {
    const poolState = (0, state_1.getPoolState)(pool);
    let connection;
    let remainingConnectionRetryLimit = connectionRetryLimit + 1;
    // eslint-disable-next-line no-constant-condition
    while (true) {
        remainingConnectionRetryLimit--;
        try {
            connection = await pool.connect();
            state_1.poolClientStateMap.set(connection, {
                connectionId: (0, createUid_1.createUid)(),
                mock: poolState.mock,
                poolId: poolState.poolId,
                terminated: null,
                transactionDepth: null,
                transactionId: null,
            });
            break;
        }
        catch (error) {
            parentLog.error({
                error: (0, serialize_error_1.serializeError)(error),
                remainingConnectionRetryLimit,
            }, 'cannot establish connection');
            if (remainingConnectionRetryLimit > 1) {
                parentLog.info('retrying connection');
                continue;
            }
            else {
                throw new errors_1.ConnectionError(error.message, {
                    cause: error,
                });
            }
        }
    }
    if (!connection) {
        throw new errors_1.UnexpectedStateError('Connection handle is not present.');
    }
    return connection;
};
exports.establishConnection = establishConnection;
//# sourceMappingURL=establishConnection.js.map