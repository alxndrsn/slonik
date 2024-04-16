/// <reference types="node" />
import { type ClientConfigurationInput } from '../types';
import EventEmitter from 'node:events';
import * as sinon from 'sinon';
export declare const createPool: (clientConfiguration?: ClientConfigurationInput) => Promise<{
    connection: {
        connection: {
            slonik: {
                connectionId: string;
                mock: boolean;
                poolId: string;
                transactionDepth: null;
            };
        };
        emit: <K>(eventName: string | symbol, ...args: any[]) => boolean;
        end: () => void;
        off: <K_1>(eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter<[never]>;
        on: <K_2>(eventName: string | symbol, listener: (...args: any[]) => void) => EventEmitter<[never]>;
        query: () => {};
        release: () => void;
    };
    connectSpy: sinon.SinonSpy<any[], any>;
    endSpy: sinon.SinonSpy<any[], any>;
    querySpy: sinon.SinonStub<any[], any>;
    releaseSpy: sinon.SinonSpy<any[], any>;
    removeSpy: sinon.SinonSpy<any[], any>;
    any: <T extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T>, values?: import("../types").QueryResultRowColumn[] | undefined) => Promise<readonly import("zod").TypeOf<T>[]>;
    anyFirst: <T_1 extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T_1>, values?: import("../types").QueryResultRowColumn[] | undefined) => Promise<readonly import("zod").TypeOf<T_1>[keyof import("zod").TypeOf<T_1>][]>;
    exists: <T_2 extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T_2>, values?: import("../types").QueryResultRowColumn[] | undefined) => Promise<boolean>;
    many: <T_3 extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T_3>, values?: import("../types").QueryResultRowColumn[] | undefined) => Promise<readonly import("zod").TypeOf<T_3>[]>;
    manyFirst: <T_4 extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T_4>, values?: import("../types").QueryResultRowColumn[] | undefined) => Promise<readonly import("zod").TypeOf<T_4>[keyof import("zod").TypeOf<T_4>][]>;
    maybeOne: <T_5 extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T_5>, values?: import("../types").QueryResultRowColumn[] | undefined) => Promise<import("zod").TypeOf<T_5> | null>;
    maybeOneFirst: <T_6 extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T_6>, values?: import("../types").QueryResultRowColumn[] | undefined) => Promise<import("zod").TypeOf<T_6>[keyof import("zod").TypeOf<T_6>] | null>;
    one: <T_7 extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T_7>, values?: import("../types").QueryResultRowColumn[] | undefined) => Promise<import("zod").TypeOf<T_7>>;
    oneFirst: <T_8 extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T_8>, values?: import("../types").QueryResultRowColumn[] | undefined) => Promise<import("zod").TypeOf<T_8>[keyof import("zod").TypeOf<T_8>]>;
    query: import("../types").QueryFunction;
    transaction: <T_9>(handler: (connection: import("../types").DatabaseTransactionConnection) => Promise<T_9>, transactionRetryLimit?: number | undefined) => Promise<T_9>;
    configuration: import("../types").ClientConfiguration;
    connect: <T_10>(connectionRoutine: import("../types").ConnectionRoutine<T_10>) => Promise<T_10>;
    end: () => Promise<void>;
    getPoolState: () => {
        readonly activeConnectionCount: number;
        readonly ended: boolean;
        readonly idleConnectionCount: number;
        readonly waitingClientCount: number;
    };
    stream: <T_11 extends import("zod").ZodTypeAny>(sql: import("../types").QuerySqlToken<T_11>, streamHandler: import("../types").StreamHandler<import("zod").TypeOf<T_11>>, config?: import("../types").QueryStreamConfig | undefined) => Promise<import("../types").StreamResult>;
}>;
//# sourceMappingURL=createPool.d.ts.map