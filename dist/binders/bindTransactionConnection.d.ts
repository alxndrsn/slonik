import { type ClientConfiguration, type DatabaseTransactionConnection, type Logger } from '../types';
import { type PoolClient as PgPoolClient } from 'pg';
export declare const bindTransactionConnection: (parentLog: Logger, connection: PgPoolClient, clientConfiguration: ClientConfiguration, transactionDepth: number) => DatabaseTransactionConnection;
//# sourceMappingURL=bindTransactionConnection.d.ts.map