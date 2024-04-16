import { type ClientConfiguration, type DatabasePoolConnection, type Logger } from '../types';
import { type PoolClient as PgPoolClient } from 'pg';
export declare const bindPoolConnection: (parentLog: Logger, connection: PgPoolClient, clientConfiguration: ClientConfiguration) => DatabasePoolConnection;
//# sourceMappingURL=bindPoolConnection.d.ts.map