"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defer = void 0;
const defer = () => {
    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    return deferred;
};
exports.defer = defer;
//# sourceMappingURL=defer.js.map