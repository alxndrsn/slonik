import { type PrimitiveValueExpression, type Query, type QueryResultRow } from './types';
import { type ZodIssue } from 'zod';
export declare class SlonikError extends Error {
    readonly message: string;
    readonly cause?: Error;
    constructor(message: string, options?: {
        cause?: Error;
    });
}
export declare class InvalidConfigurationError extends SlonikError {
}
export declare class InvalidInputError extends SlonikError {
}
export declare class InputSyntaxError extends SlonikError {
    sql: string;
    constructor(error: Error, query: Query);
}
export declare class UnexpectedStateError extends SlonikError {
}
export declare class ConnectionError extends SlonikError {
}
export declare class StatementCancelledError extends SlonikError {
    constructor(error: Error);
}
export declare class StatementTimeoutError extends SlonikError {
    constructor(error: Error);
}
export declare class BackendTerminatedUnexpectedlyError extends SlonikError {
    constructor(error: Error);
}
export declare class BackendTerminatedError extends SlonikError {
    constructor(error: Error);
}
export declare class TupleMovedToAnotherPartitionError extends SlonikError {
    constructor(error: Error);
}
export declare class NotFoundError extends SlonikError {
    sql: string;
    values: readonly PrimitiveValueExpression[];
    constructor(query: Query);
}
export declare class DataIntegrityError extends SlonikError {
    sql: string;
    values: readonly PrimitiveValueExpression[];
    constructor(query: Query);
}
export declare class SchemaValidationError extends SlonikError {
    sql: string;
    values: readonly PrimitiveValueExpression[];
    row: QueryResultRow;
    issues: ZodIssue[];
    constructor(query: Query, row: QueryResultRow, issues: ZodIssue[]);
}
type IntegrityConstraintViolationErrorCause = Error & {
    column?: string;
    constraint?: string;
    table?: string;
};
export declare class IntegrityConstraintViolationError extends SlonikError {
    constraint: string | null;
    column: string | null;
    table: string | null;
    cause?: Error;
    constructor(message: string, error: IntegrityConstraintViolationErrorCause);
}
export declare class NotNullIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error: IntegrityConstraintViolationErrorCause);
}
export declare class ForeignKeyIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error: IntegrityConstraintViolationErrorCause);
}
export declare class UniqueIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error: IntegrityConstraintViolationErrorCause);
}
export declare class CheckIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error: IntegrityConstraintViolationErrorCause);
}
export {};
//# sourceMappingURL=errors.d.ts.map