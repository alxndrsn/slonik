import { type TypeOverrides } from './types';
import { type DeferredPromise } from './utilities/defer';
import { type Pool as PgPool, type PoolClient as PgClientPool } from 'pg';
export type PoolState = {
    ended: boolean;
    mock: boolean;
    poolId: string;
    typeOverrides: Promise<TypeOverrides> | null;
};
type PoolClientState = {
    activeQuery?: DeferredPromise<null>;
    connectionId: string;
    mock: boolean;
    poolId: string;
    terminated: Error | null;
    transactionDepth: number | null;
    transactionId: string | null;
};
export declare const poolStateMap: WeakMap<PgPool, PoolState>;
export declare const poolClientStateMap: WeakMap<PgClientPool, PoolClientState>;
export declare const getPoolState: (pool: PgPool) => PoolState;
export declare const getPoolClientState: (poolClient: PgClientPool) => PoolClientState;
export {};
//# sourceMappingURL=state.d.ts.map