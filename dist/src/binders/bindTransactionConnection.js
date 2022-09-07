"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindTransactionConnection = void 0;
const assertions_1 = require("../assertions");
const connectionMethods_1 = require("../connectionMethods");
const bindTransactionConnection = (parentLog, connection, clientConfiguration, transactionDepth) => {
    const assertTransactionDepth = () => {
        if (transactionDepth !== connection.connection.slonik.transactionDepth) {
            throw new Error('Cannot run a query using parent transaction.');
        }
    };
    return {
        any: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.any(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        anyFirst: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.anyFirst(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        exists: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.exists(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        many: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.many(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        manyFirst: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.manyFirst(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        maybeOne: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.maybeOne(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        maybeOneFirst: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.maybeOneFirst(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        one: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.one(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        oneFirst: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.oneFirst(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        query: (query) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.query(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        stream: (query, streamHandler) => {
            assertions_1.assertSqlSqlToken(query);
            assertTransactionDepth();
            return connectionMethods_1.stream(parentLog, connection, clientConfiguration, query.sql, query.values, streamHandler);
        },
        transaction: (handler) => {
            assertTransactionDepth();
            return connectionMethods_1.nestedTransaction(parentLog, connection, clientConfiguration, handler, transactionDepth);
        },
    };
};
exports.bindTransactionConnection = bindTransactionConnection;
//# sourceMappingURL=bindTransactionConnection.js.map