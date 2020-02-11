// @flow

import {
  Duplex,
} from 'stream';
import {
  from,
} from 'pg-copy-streams';
import {
  executeQuery,
} from '../routines';
import type {
  InternalCopyFromBinaryFunctionType,
} from '../types';
import {
  encodeTupleList,
} from '../utilities';
import {
  UnexpectedStateError,
} from '../errors';

const bufferToStream = (buffer) => {
  const stream = new Duplex();

  stream.push(buffer);
  stream.push(null);

  return stream;
};

const copyFromBinary: InternalCopyFromBinaryFunctionType = async (
  connectionLogger,
  connection,
  clientConfiguration,
  rawSql,
  boundValues,
  tupleList,
  columnTypes,
) => {
  if (connection.connection.slonik.native) {
    throw new UnexpectedStateError('COPY streams do not work with the native driver. Use JavaScript driver.');
  }

  const payloadBuffer = await encodeTupleList(tupleList, columnTypes);

  return executeQuery(
    connectionLogger,
    connection,
    clientConfiguration,
    rawSql,
    boundValues,
    undefined,
    (finalConnection, finalSql) => {
      const copyFromBinaryStream = finalConnection.query(from(finalSql));

      bufferToStream(payloadBuffer).pipe(copyFromBinaryStream);

      return new Promise((resolve, reject) => {
        copyFromBinaryStream.on('error', (error) => {
          reject(error);
        });

        copyFromBinaryStream.on('end', () => {
          // $FlowFixMe
          resolve({});
        });
      });
    },
  );
};

export default copyFromBinary;
