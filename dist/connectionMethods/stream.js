"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = void 0;
const executeQuery_1 = require("../routines/executeQuery");
const node_stream_1 = require("node:stream");
const promises_1 = require("node:stream/promises");
const pg_query_stream_1 = __importDefault(require("pg-query-stream"));
const createTransformStream = (connection, clientConfiguration, queryContext, query) => {
    const rowTransformers = [];
    for (const interceptor of clientConfiguration.interceptors) {
        if (interceptor.transformRow) {
            rowTransformers.push(interceptor.transformRow);
        }
    }
    let fields = [];
    // `rowDescription` will not fire if the query produces a syntax error.
    // Also, `rowDescription` won't fire until client starts consuming the stream.
    // This is why we cannot simply await for `rowDescription` event before starting to pipe the stream.
    // @ts-expect-error – https://github.com/brianc/node-postgres/issues/3015
    connection.connection.once('rowDescription', (rowDescription) => {
        fields = rowDescription.fields.map((field) => {
            return {
                dataTypeId: field.dataTypeID,
                name: field.name,
            };
        });
    });
    return new node_stream_1.Transform({
        objectMode: true,
        async transform(datum, enc, callback) {
            if (!fields) {
                callback(new Error('Fields not available'));
                return;
            }
            let finalRow = datum;
            // apply row transformers. Note this is done sequentially, as one transformer's result will be passed to the next.
            for (const rowTransformer of rowTransformers) {
                finalRow = await rowTransformer(queryContext, query, finalRow, fields);
            }
            // eslint-disable-next-line @babel/no-invalid-this
            this.push({
                data: finalRow,
                fields,
            });
            callback();
        },
    });
};
const createExecutionRoutine = (clientConfiguration, onStream, streamOptions) => {
    return async (connection, sql, values, executionContext, actualQuery) => {
        const queryStream = connection.query(new pg_query_stream_1.default(sql, values, streamOptions));
        const transformStream = createTransformStream(connection, clientConfiguration, executionContext, actualQuery);
        onStream(transformStream);
        await (0, promises_1.pipeline)(queryStream, transformStream);
        return {
            notices: [],
            type: 'StreamResult',
        };
    };
};
const stream = async (connectionLogger, connection, clientConfiguration, slonikSql, onStream, uid, streamOptions) => {
    const result = await (0, executeQuery_1.executeQuery)(connectionLogger, connection, clientConfiguration, slonikSql, undefined, createExecutionRoutine(clientConfiguration, onStream, streamOptions), true);
    if (result.type === 'QueryResult') {
        throw new Error('Query result cannot be returned in a streaming context.');
    }
    return result;
};
exports.stream = stream;
//# sourceMappingURL=stream.js.map