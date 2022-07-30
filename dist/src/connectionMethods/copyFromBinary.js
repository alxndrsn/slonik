"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFromBinary = void 0;
const stream_1 = require("stream");
const pg_copy_streams_1 = require("pg-copy-streams");
const routines_1 = require("../routines");
const utilities_1 = require("../utilities");
const bufferToStream = (buffer) => {
    const stream = new stream_1.Duplex();
    stream.push(buffer);
    stream.push(null);
    return stream;
};
const copyFromBinary = async (connectionLogger, connection, clientConfiguration, slonikSql, tupleList, columnTypes) => {
    const payloadBuffer = await (0, utilities_1.encodeTupleList)(tupleList, columnTypes);
    return await (0, routines_1.executeQuery)(connectionLogger, connection, clientConfiguration, slonikSql, undefined, (finalConnection, finalSql) => {
        const copyFromBinaryStream = finalConnection.query((0, pg_copy_streams_1.from)(finalSql));
        bufferToStream(payloadBuffer).pipe(copyFromBinaryStream);
        return new Promise((resolve, reject) => {
            copyFromBinaryStream.on('error', (error) => {
                reject(error);
            });
            copyFromBinaryStream.on('finish', () => {
                resolve({
                    command: 'COPY',
                    fields: [],
                    notices: [],
                    rowCount: 0,
                    rows: [],
                });
            });
        });
    });
};
exports.copyFromBinary = copyFromBinary;
