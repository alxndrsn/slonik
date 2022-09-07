import type { DatabasePoolType } from '../types';
/**
 * @param connectionUri PostgreSQL [Connection URI](https://www.postgresql.org/docs/current/libpq-connect.html#LIBPQ-CONNSTRING).
 */
export declare const createPool: (connectionUri: string, clientConfigurationInput?: Partial<import("../types").ClientConfigurationType> | undefined) => DatabasePoolType;
