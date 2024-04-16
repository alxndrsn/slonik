import { type TypeParser } from '../types';
import { type PoolClient } from 'pg';
export declare const createTypeOverrides: (connection: PoolClient, typeParsers: readonly TypeParser[]) => Promise<(oid: number) => any>;
//# sourceMappingURL=createTypeOverrides.d.ts.map