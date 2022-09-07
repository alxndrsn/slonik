"use strict";
/* eslint-disable ava/max-asserts */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const createSqlTag_1 = require("../../../../src/factories/createSqlTag");
const createPool_1 = require("../../../helpers/createPool");
const sql = createSqlTag_1.createSqlTag();
ava_1.default('ends connection after promise is resolved (explicit connection)', async (t) => {
    const pool = createPool_1.createPool();
    await pool.connect(() => {
        return Promise.resolve('foo');
    });
    t.assert(pool.connectSpy.callCount === 1);
    t.assert(pool.releaseSpy.callCount === 0);
    t.assert(pool.removeSpy.callCount === 1);
});
ava_1.default('release connection after promise is resolved (implicit connection)', async (t) => {
    const pool = createPool_1.createPool();
    await pool.query(sql `SELECT 1`);
    t.assert(pool.connectSpy.callCount === 1);
    t.assert(pool.releaseSpy.callCount === 1);
    t.assert(pool.removeSpy.callCount === 0);
});
ava_1.default('ends connection after promise is rejected', async (t) => {
    const pool = createPool_1.createPool();
    await t.throwsAsync(pool.connect(async () => {
        return Promise.reject(new Error('foo'));
    }));
    t.assert(pool.connectSpy.callCount === 1);
    t.assert(pool.releaseSpy.callCount === 0);
    t.assert(pool.removeSpy.callCount === 1);
});
ava_1.default('does not connect if `beforePoolConnection` throws an error', async (t) => {
    const pool = createPool_1.createPool({
        interceptors: [
            {
                beforePoolConnection: () => {
                    return Promise.reject(new Error('foo'));
                },
            },
        ],
    });
    await t.throwsAsync(pool.connect(async () => {
        return null;
    }));
    t.assert(pool.connectSpy.callCount === 0);
    t.assert(pool.releaseSpy.callCount === 0);
    t.assert(pool.removeSpy.callCount === 0);
});
ava_1.default('ends connection if `afterPoolConnection` throws an error', async (t) => {
    const pool = createPool_1.createPool({
        interceptors: [
            {
                afterPoolConnection: () => {
                    return Promise.reject(new Error('foo'));
                },
            },
        ],
    });
    await t.throwsAsync(pool.connect(async () => {
        return null;
    }));
    t.assert(pool.connectSpy.callCount === 1);
    t.assert(pool.releaseSpy.callCount === 0);
    t.assert(pool.removeSpy.callCount === 1);
});
ava_1.default('ends connection if `beforePoolConnectionRelease` throws an error', async (t) => {
    const pool = createPool_1.createPool({
        interceptors: [
            {
                afterPoolConnection: () => {
                    return Promise.reject(new Error('foo'));
                },
            },
        ],
    });
    await t.throwsAsync(pool.connect(async () => {
        return null;
    }));
    t.assert(pool.connectSpy.callCount === 1);
    t.assert(pool.releaseSpy.callCount === 0);
    t.assert(pool.removeSpy.callCount === 1);
});
ava_1.default('if `beforePoolConnection` returns pool object, then the returned pool object is used to create a new connection (IMPLICIT_QUERY)', async (t) => {
    const pool0 = createPool_1.createPool();
    const pool1 = createPool_1.createPool({
        interceptors: [
            {
                beforePoolConnection: () => {
                    return pool0;
                },
            },
        ],
    });
    await pool1.query(sql `SELECT 1`);
    t.assert(pool0.connectSpy.callCount === 1);
    t.assert(pool0.releaseSpy.callCount === 1);
    t.assert(pool0.removeSpy.callCount === 0);
    t.assert(pool1.connectSpy.callCount === 0);
    t.assert(pool1.releaseSpy.callCount === 0);
    t.assert(pool1.removeSpy.callCount === 0);
});
ava_1.default('if `beforePoolConnection` returns pool object, then the returned pool object is used to create a connection (IMPLICIT_TRANSACTION)', async (t) => {
    const pool0 = createPool_1.createPool();
    const pool1 = createPool_1.createPool({
        interceptors: [
            {
                beforePoolConnection: () => {
                    return pool0;
                },
            },
        ],
    });
    await pool1.transaction((connection) => {
        return connection.query(sql `SELECT 1`);
    });
    t.assert(pool0.connectSpy.callCount === 1);
    t.assert(pool0.releaseSpy.callCount === 0);
    t.assert(pool0.removeSpy.callCount === 1);
    t.assert(pool1.connectSpy.callCount === 0);
    t.assert(pool1.releaseSpy.callCount === 0);
    t.assert(pool1.removeSpy.callCount === 0);
});
ava_1.default('if `beforePoolConnection` returns pool object, then the returned pool object is used to create a connection (EXPLICIT)', async (t) => {
    const pool0 = createPool_1.createPool();
    const pool1 = createPool_1.createPool({
        interceptors: [
            {
                beforePoolConnection: () => {
                    return pool0;
                },
            },
        ],
    });
    await pool1.connect((connection) => {
        return connection.query(sql `SELECT 1`);
    });
    t.assert(pool0.connectSpy.callCount === 1);
    t.assert(pool0.releaseSpy.callCount === 0);
    t.assert(pool0.removeSpy.callCount === 1);
    t.assert(pool1.connectSpy.callCount === 0);
    t.assert(pool1.releaseSpy.callCount === 0);
    t.assert(pool1.removeSpy.callCount === 0);
});
ava_1.default('if `beforePoolConnection` returns null, then the current pool object is used to create a connection', async (t) => {
    const pool = createPool_1.createPool({
        interceptors: [
            {
                beforePoolConnection: () => {
                    return null;
                },
            },
        ],
    });
    await pool.query(sql `SELECT 1`);
    t.assert(pool.connectSpy.callCount === 1);
    t.assert(pool.releaseSpy.callCount === 1);
    t.assert(pool.removeSpy.callCount === 0);
});
//# sourceMappingURL=connect.js.map