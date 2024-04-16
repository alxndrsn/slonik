"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMockQueryResult = void 0;
const createMockQueryResult = (rows) => {
    let fields = [];
    if (rows.length > 0) {
        fields = Object.keys(rows[0]).map((it) => ({ dataTypeId: 0, name: it }));
    }
    return {
        command: 'SELECT',
        fields,
        notices: [],
        rowCount: rows.length,
        rows,
        type: 'QueryResult',
    };
};
exports.createMockQueryResult = createMockQueryResult;
//# sourceMappingURL=createMockQueryResult.js.map