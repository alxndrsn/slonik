"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPrimitiveValueExpressions = void 0;
const Logger_1 = require("../Logger");
const errors_1 = require("../errors");
const log = Logger_1.Logger.child({
    namespace: 'createPrimitiveValueExpressions',
});
const createPrimitiveValueExpressions = (values) => {
    const primitiveValueExpressions = [];
    for (const value of values) {
        if (Array.isArray(value) || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
            primitiveValueExpressions.push(value);
        }
        else {
            log.warn({
                value,
                values,
            }, 'unexpected value expression');
            throw new errors_1.UnexpectedStateError('Unexpected value expression.');
        }
    }
    return primitiveValueExpressions;
};
exports.createPrimitiveValueExpressions = createPrimitiveValueExpressions;
//# sourceMappingURL=createPrimitiveValueExpressions.js.map