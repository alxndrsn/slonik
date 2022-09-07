import type { ClientConfigurationType, InternalDatabaseConnectionType, Logger, PrimitiveValueExpressionType, QueryContextType, QueryResultRowType, QueryResultType, QueryType } from '../types';
declare type GenericQueryResult = QueryResultType<QueryResultRowType>;
declare type ExecutionRoutineType = (connection: InternalDatabaseConnectionType, sql: string, values: readonly PrimitiveValueExpressionType[], queryContext: QueryContextType, query: QueryType) => Promise<GenericQueryResult>;
export declare const executeQuery: (connectionLogger: Logger, connection: InternalDatabaseConnectionType, clientConfiguration: ClientConfigurationType, rawSql: string, values: readonly PrimitiveValueExpressionType[], inheritedQueryId?: string | undefined, executionRoutine?: ExecutionRoutineType | undefined) => Promise<QueryResultType<Record<string, PrimitiveValueExpressionType>>>;
export {};
