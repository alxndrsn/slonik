import { type ClientConfiguration, type Connection, type DatabasePool, type DatabasePoolConnection, type Logger, type MaybePromise, type QuerySqlToken } from '../types';
import { type Pool as PgPool, type PoolClient as PgPoolClient } from 'pg';
type ConnectionHandlerType = (connectionLog: Logger, connection: PgPoolClient, boundConnection: DatabasePoolConnection, clientConfiguration: ClientConfiguration) => MaybePromise<unknown>;
type PoolHandlerType = (pool: DatabasePool) => Promise<unknown>;
export declare const createConnection: (parentLog: Logger, pool: PgPool, clientConfiguration: ClientConfiguration, connectionType: Connection, connectionHandler: ConnectionHandlerType, poolHandler: PoolHandlerType, query?: QuerySqlToken | null) => Promise<any>;
export {};
//# sourceMappingURL=createConnection.d.ts.map