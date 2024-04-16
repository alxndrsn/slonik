"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckIntegrityConstraintViolationError = exports.UniqueIntegrityConstraintViolationError = exports.ForeignKeyIntegrityConstraintViolationError = exports.NotNullIntegrityConstraintViolationError = exports.IntegrityConstraintViolationError = exports.SchemaValidationError = exports.DataIntegrityError = exports.NotFoundError = exports.TupleMovedToAnotherPartitionError = exports.BackendTerminatedError = exports.BackendTerminatedUnexpectedlyError = exports.StatementTimeoutError = exports.StatementCancelledError = exports.ConnectionError = exports.UnexpectedStateError = exports.InputSyntaxError = exports.InvalidInputError = exports.InvalidConfigurationError = exports.SlonikError = void 0;
class SlonikError extends Error {
    constructor(message, options) {
        super(message);
        this.message = message || this.constructor.name;
        this.cause = options?.cause;
    }
}
exports.SlonikError = SlonikError;
class InvalidConfigurationError extends SlonikError {
}
exports.InvalidConfigurationError = InvalidConfigurationError;
class InvalidInputError extends SlonikError {
}
exports.InvalidInputError = InvalidInputError;
class InputSyntaxError extends SlonikError {
    constructor(error, query) {
        super(error.message, {
            cause: error,
        });
        this.sql = query.sql;
    }
}
exports.InputSyntaxError = InputSyntaxError;
class UnexpectedStateError extends SlonikError {
}
exports.UnexpectedStateError = UnexpectedStateError;
class ConnectionError extends SlonikError {
}
exports.ConnectionError = ConnectionError;
class StatementCancelledError extends SlonikError {
    constructor(error) {
        super('Statement has been cancelled.', { cause: error });
    }
}
exports.StatementCancelledError = StatementCancelledError;
class StatementTimeoutError extends SlonikError {
    constructor(error) {
        super('Statement has been cancelled due to a statement_timeout.', {
            cause: error,
        });
    }
}
exports.StatementTimeoutError = StatementTimeoutError;
class BackendTerminatedUnexpectedlyError extends SlonikError {
    constructor(error) {
        super('Backend has been terminated unexpectedly.', { cause: error });
    }
}
exports.BackendTerminatedUnexpectedlyError = BackendTerminatedUnexpectedlyError;
class BackendTerminatedError extends SlonikError {
    constructor(error) {
        super('Backend has been terminated.', { cause: error });
    }
}
exports.BackendTerminatedError = BackendTerminatedError;
class TupleMovedToAnotherPartitionError extends SlonikError {
    constructor(error) {
        super('Tuple moved to another partition due to concurrent update.', {
            cause: error,
        });
    }
}
exports.TupleMovedToAnotherPartitionError = TupleMovedToAnotherPartitionError;
class NotFoundError extends SlonikError {
    constructor(query) {
        super('Resource not found.');
        this.sql = query.sql;
        this.values = query.values;
    }
}
exports.NotFoundError = NotFoundError;
class DataIntegrityError extends SlonikError {
    constructor(query) {
        super('Query returned an unexpected result.');
        this.sql = query.sql;
        this.values = query.values;
    }
}
exports.DataIntegrityError = DataIntegrityError;
class SchemaValidationError extends SlonikError {
    constructor(query, row, issues) {
        super('Query returned rows that do not conform with the schema.');
        this.sql = query.sql;
        this.values = query.values;
        this.row = row;
        this.issues = issues;
    }
}
exports.SchemaValidationError = SchemaValidationError;
class IntegrityConstraintViolationError extends SlonikError {
    constructor(message, error) {
        super(message, { cause: error });
        this.constraint = error.constraint ?? null;
        this.column = error.column ?? null;
        this.table = error.table ?? null;
    }
}
exports.IntegrityConstraintViolationError = IntegrityConstraintViolationError;
// @todo When does restrict_violation and exclusion_violation happen?
// @see https://www.postgresql.org/docs/9.4/static/errcodes-appendix.html
class NotNullIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error) {
        super('Query violates a not NULL integrity constraint.', error);
    }
}
exports.NotNullIntegrityConstraintViolationError = NotNullIntegrityConstraintViolationError;
class ForeignKeyIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error) {
        super('Query violates a foreign key integrity constraint.', error);
    }
}
exports.ForeignKeyIntegrityConstraintViolationError = ForeignKeyIntegrityConstraintViolationError;
class UniqueIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error) {
        super('Query violates a unique integrity constraint.', error);
    }
}
exports.UniqueIntegrityConstraintViolationError = UniqueIntegrityConstraintViolationError;
class CheckIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error) {
        super('Query violates a check integrity constraint.', error);
    }
}
exports.CheckIntegrityConstraintViolationError = CheckIntegrityConstraintViolationError;
//# sourceMappingURL=errors.js.map