"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createClientConfiguration_1 = require("./createClientConfiguration");
const createTypeParserPreset_1 = require("./createTypeParserPreset");
const ava_1 = __importDefault(require("ava"));
const defaultConfiguration = {
    captureStackTrace: false,
    connectionRetryLimit: 3,
    connectionTimeout: 5000,
    idleInTransactionSessionTimeout: 60000,
    idleTimeout: 5000,
    interceptors: [],
    maximumPoolSize: 10,
    queryRetryLimit: 5,
    statementTimeout: 60000,
    transactionRetryLimit: 5,
    typeParsers: (0, createTypeParserPreset_1.createTypeParserPreset)(),
};
(0, ava_1.default)('creates default configuration', (t) => {
    const configuration = (0, createClientConfiguration_1.createClientConfiguration)();
    t.deepEqual(configuration, defaultConfiguration);
});
(0, ava_1.default)('overrides provided properties', (t) => {
    t.deepEqual((0, createClientConfiguration_1.createClientConfiguration)({
        captureStackTrace: false,
    }), {
        ...defaultConfiguration,
        captureStackTrace: false,
    });
    t.deepEqual((0, createClientConfiguration_1.createClientConfiguration)({
        interceptors: [
            // @ts-expect-error - This is a test helper.
            'foo',
        ],
    }), {
        ...defaultConfiguration,
        interceptors: ['foo'],
    });
    t.deepEqual((0, createClientConfiguration_1.createClientConfiguration)({
        typeParsers: [
            // @ts-expect-error - This is a test helper.
            'foo',
        ],
    }), {
        ...defaultConfiguration,
        typeParsers: ['foo'],
    });
});
(0, ava_1.default)('disables default type parsers', (t) => {
    t.deepEqual((0, createClientConfiguration_1.createClientConfiguration)({
        typeParsers: [],
    }), {
        ...defaultConfiguration,
        typeParsers: [],
    });
});
//# sourceMappingURL=createClientConfiguration.test.js.map