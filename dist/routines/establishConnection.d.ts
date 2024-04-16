import { type Logger } from '../types';
import { type Pool as PgPool, type PoolClient as PgPoolClient } from 'pg';
export declare const establishConnection: (parentLog: Logger, pool: PgPool, connectionRetryLimit: number) => Promise<PgPoolClient>;
//# sourceMappingURL=establishConnection.d.ts.map