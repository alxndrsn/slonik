import type { DatabasePoolType, PrimitiveValueExpressionType, QueryResultRowType, QueryResultType } from '../types';
declare type OverridesType = {
    readonly query: (sql: string, values: readonly PrimitiveValueExpressionType[]) => Promise<QueryResultType<QueryResultRowType>>;
};
export declare const createMockPool: (overrides: OverridesType, clientConfigurationInput?: Partial<import("../types").ClientConfigurationType> | undefined) => DatabasePoolType;
export {};
