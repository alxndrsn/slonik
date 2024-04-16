"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../Logger");
const state_1 = require("../state");
const establishConnection_1 = require("./establishConnection");
const ava_1 = __importDefault(require("ava"));
const sinon = __importStar(require("sinon"));
(0, ava_1.default)('attempts to connection X times', async (t) => {
    const pool = {
        connect: sinon.stub(),
    };
    state_1.poolStateMap.set(pool, {});
    const connectionRetryLimit = 3;
    await t.throwsAsync((0, establishConnection_1.establishConnection)(Logger_1.Logger, pool, connectionRetryLimit));
    t.is(pool.connect.callCount, connectionRetryLimit);
});
(0, ava_1.default)('does not attempt to retry connection when set to 0', async (t) => {
    const pool = {
        connect: sinon.stub(),
    };
    state_1.poolStateMap.set(pool, {});
    const connectionRetryLimit = 0;
    await t.throwsAsync((0, establishConnection_1.establishConnection)(Logger_1.Logger, pool, connectionRetryLimit));
    t.is(pool.connect.callCount, 1);
});
//# sourceMappingURL=establishConnection.test.js.map