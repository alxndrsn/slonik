"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTypeParserPreset = void 0;
const typeParsers_1 = require("./typeParsers");
const createTypeParserPreset = () => {
    return [
        typeParsers_1.createBigintTypeParser(),
        typeParsers_1.createDateTypeParser(),
        typeParsers_1.createIntervalTypeParser(),
        typeParsers_1.createNumericTypeParser(),
        typeParsers_1.createTimestampTypeParser(),
        typeParsers_1.createTimestampWithTimeZoneTypeParser(),
    ];
};
exports.createTypeParserPreset = createTypeParserPreset;
//# sourceMappingURL=createTypeParserPreset.js.map