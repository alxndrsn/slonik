"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const createClientConfiguration_1 = require("../../../src/factories/createClientConfiguration");
const createTypeParserPreset_1 = require("../../../src/factories/createTypeParserPreset");
const defaultConfiguration = {
    captureStackTrace: true,
    connectionRetryLimit: 3,
    connectionTimeout: 5000,
    idleInTransactionSessionTimeout: 60000,
    idleTimeout: 5000,
    interceptors: [],
    maximumPoolSize: 10,
    preferNativeBindings: true,
    statementTimeout: 60000,
    transactionRetryLimit: 5,
    typeParsers: createTypeParserPreset_1.createTypeParserPreset(),
};
ava_1.default('creates default configuration', (t) => {
    const configuration = createClientConfiguration_1.createClientConfiguration();
    t.deepEqual(configuration, defaultConfiguration);
});
ava_1.default('overrides provided properties', (t) => {
    t.deepEqual(createClientConfiguration_1.createClientConfiguration({
        captureStackTrace: false,
    }), {
        ...defaultConfiguration,
        captureStackTrace: false,
    });
    t.deepEqual(createClientConfiguration_1.createClientConfiguration({
        interceptors: [
            // @ts-expect-error
            'foo',
        ],
    }), {
        ...defaultConfiguration,
        interceptors: [
            // @ts-expect-error
            'foo',
        ],
    });
    t.deepEqual(createClientConfiguration_1.createClientConfiguration({
        typeParsers: [
            // @ts-expect-error
            'foo',
        ],
    }), {
        ...defaultConfiguration,
        typeParsers: [
            // @ts-expect-error
            'foo',
        ],
    });
});
ava_1.default('disables default type parsers', (t) => {
    t.deepEqual(createClientConfiguration_1.createClientConfiguration({
        typeParsers: [],
    }), {
        ...defaultConfiguration,
        typeParsers: [],
    });
});
//# sourceMappingURL=createClientConfiguration.js.map