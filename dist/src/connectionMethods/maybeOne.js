"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maybeOne = void 0;
const errors_1 = require("../errors");
const utilities_1 = require("../utilities");
const query_1 = require("./query");
/**
 * Makes a query and expects exactly one result.
 *
 * @throws DataIntegrityError If query returns multiple rows.
 */
const maybeOne = async (log, connection, clientConfiguration, rawSql, values, inheritedQueryId) => {
    const queryId = inheritedQueryId !== null && inheritedQueryId !== void 0 ? inheritedQueryId : utilities_1.createQueryId();
    const { rows, } = await query_1.query(log, connection, clientConfiguration, rawSql, values, queryId);
    if (rows.length === 0) {
        return null;
    }
    if (rows.length > 1) {
        log.error({
            queryId,
        }, 'DataIntegrityError');
        throw new errors_1.DataIntegrityError();
    }
    return rows[0];
};
exports.maybeOne = maybeOne;
//# sourceMappingURL=maybeOne.js.map