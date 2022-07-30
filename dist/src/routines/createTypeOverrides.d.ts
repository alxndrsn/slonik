import { type PoolClient as PgPoolClient } from 'pg';
import { type TypeOverrides as TypeOverridesType, type TypeParser } from '../types';
export declare const createTypeOverrides: (connection: PgPoolClient, typeParsers: readonly TypeParser[]) => Promise<TypeOverridesType>;
