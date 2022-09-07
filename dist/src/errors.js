"use strict";
/* eslint-disable fp/no-class, fp/no-this */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckIntegrityConstraintViolationError = exports.UniqueIntegrityConstraintViolationError = exports.ForeignKeyIntegrityConstraintViolationError = exports.NotNullIntegrityConstraintViolationError = exports.IntegrityConstraintViolationError = exports.DataIntegrityError = exports.NotFoundError = exports.BackendTerminatedError = exports.StatementTimeoutError = exports.StatementCancelledError = exports.ConnectionError = exports.UnexpectedStateError = exports.InvalidInputError = exports.InvalidConfigurationError = exports.WrappedPGError = exports.SlonikError = void 0;
const es6_error_1 = __importDefault(require("es6-error"));
class SlonikError extends es6_error_1.default {
}
exports.SlonikError = SlonikError;
class WrappedPGError extends SlonikError {
    constructor(originalError, message) {
        super(`${message} ${originalError.message}`);
        this.originalError = originalError;
    }
}
exports.WrappedPGError = WrappedPGError;
class InvalidConfigurationError extends SlonikError {
}
exports.InvalidConfigurationError = InvalidConfigurationError;
class InvalidInputError extends SlonikError {
}
exports.InvalidInputError = InvalidInputError;
class UnexpectedStateError extends SlonikError {
}
exports.UnexpectedStateError = UnexpectedStateError;
class ConnectionError extends SlonikError {
}
exports.ConnectionError = ConnectionError;
class StatementCancelledError extends WrappedPGError {
    constructor(error, message = 'Statement has been cancelled.') {
        super(error, message);
    }
}
exports.StatementCancelledError = StatementCancelledError;
class StatementTimeoutError extends StatementCancelledError {
    constructor(error) {
        super(error, 'Statement has been cancelled due to a statement_timeout.');
    }
}
exports.StatementTimeoutError = StatementTimeoutError;
class BackendTerminatedError extends WrappedPGError {
    constructor(error) {
        super(error, 'Backend has been terminated.');
    }
}
exports.BackendTerminatedError = BackendTerminatedError;
class NotFoundError extends SlonikError {
    constructor() {
        super('Resource not found.');
    }
}
exports.NotFoundError = NotFoundError;
class DataIntegrityError extends SlonikError {
    constructor() {
        super('Query returns an unexpected result.');
    }
}
exports.DataIntegrityError = DataIntegrityError;
class IntegrityConstraintViolationError extends WrappedPGError {
    constructor(error, constraint, message = 'Query violates an integrity constraint.') {
        super(error, message);
        this.constraint = constraint;
    }
}
exports.IntegrityConstraintViolationError = IntegrityConstraintViolationError;
// @todo When does restrict_violation and exclusion_violation happen?
// @see https://www.postgresql.org/docs/9.4/static/errcodes-appendix.html
class NotNullIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error, constraint) {
        super(error, constraint, 'Query violates a not NULL integrity constraint.');
    }
}
exports.NotNullIntegrityConstraintViolationError = NotNullIntegrityConstraintViolationError;
class ForeignKeyIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error, constraint) {
        super(error, constraint, 'Query violates a foreign key integrity constraint.');
    }
}
exports.ForeignKeyIntegrityConstraintViolationError = ForeignKeyIntegrityConstraintViolationError;
class UniqueIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error, constraint) {
        super(error, constraint, 'Query violates a unique integrity constraint.');
    }
}
exports.UniqueIntegrityConstraintViolationError = UniqueIntegrityConstraintViolationError;
class CheckIntegrityConstraintViolationError extends IntegrityConstraintViolationError {
    constructor(error, constraint) {
        super(error, constraint, 'Query violates a check integrity constraint.');
    }
}
exports.CheckIntegrityConstraintViolationError = CheckIntegrityConstraintViolationError;
//# sourceMappingURL=errors.js.map