import { type ClientConfiguration, type Logger, type PrimitiveValueExpression, type Query, type QueryContext, type QueryId, type QueryResult, type QueryResultRow, type QuerySqlToken, type StreamResult } from '../types';
import { type PoolClient as PgPoolClient } from 'pg';
type GenericQueryResult = StreamResult | QueryResult<QueryResultRow>;
export type ExecutionRoutine = (connection: PgPoolClient, sql: string, values: readonly PrimitiveValueExpression[], queryContext: QueryContext, query: Query) => Promise<GenericQueryResult>;
export declare const executeQuery: (connectionLogger: Logger, connection: PgPoolClient, clientConfiguration: ClientConfiguration, query: QuerySqlToken, inheritedQueryId: QueryId | undefined, executionRoutine: ExecutionRoutine, stream: boolean) => Promise<StreamResult | QueryResult<Record<string, PrimitiveValueExpression>>>;
export {};
//# sourceMappingURL=executeQuery.d.ts.map