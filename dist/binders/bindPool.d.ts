import { type ClientConfiguration, type DatabasePool, type Logger } from '../types';
import { type Pool as PgPool } from 'pg';
export declare const bindPool: (parentLog: Logger, pool: PgPool, clientConfiguration: ClientConfiguration) => DatabasePool;
//# sourceMappingURL=bindPool.d.ts.map