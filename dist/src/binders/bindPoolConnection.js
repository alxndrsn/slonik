"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bindPoolConnection = void 0;
const assertions_1 = require("../assertions");
const connectionMethods_1 = require("../connectionMethods");
const bindPoolConnection = (parentLog, connection, clientConfiguration) => {
    return {
        any: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.any(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        anyFirst: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.anyFirst(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        copyFromBinary: (query, values, columnTypes) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.copyFromBinary(parentLog, connection, clientConfiguration, query.sql, query.values, values, columnTypes);
        },
        exists: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.exists(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        many: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.many(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        manyFirst: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.manyFirst(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        maybeOne: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.maybeOne(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        maybeOneFirst: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.maybeOneFirst(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        one: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.one(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        oneFirst: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.oneFirst(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        query: (query) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.query(parentLog, connection, clientConfiguration, query.sql, query.values);
        },
        stream: (query, streamHandler) => {
            assertions_1.assertSqlSqlToken(query);
            return connectionMethods_1.stream(parentLog, connection, clientConfiguration, query.sql, query.values, streamHandler);
        },
        transaction: (handler) => {
            return connectionMethods_1.transaction(parentLog, connection, clientConfiguration, handler);
        },
    };
};
exports.bindPoolConnection = bindPoolConnection;
//# sourceMappingURL=bindPoolConnection.js.map