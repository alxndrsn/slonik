"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const countArrayDimensions_1 = require("../../../src/utilities/countArrayDimensions");
ava_1.default('returns the number of array dimensions', (t) => {
    t.assert(countArrayDimensions_1.countArrayDimensions('foo') === 0);
    t.assert(countArrayDimensions_1.countArrayDimensions('foo[]') === 1);
    t.assert(countArrayDimensions_1.countArrayDimensions('foo[][]') === 2);
});
//# sourceMappingURL=countArrayDimensions.js.map