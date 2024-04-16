import { type TestFn } from 'ava';
import { type Pool as PgPoolType, type PoolConfig } from 'pg';
type TestContextType = {
    dsn: string;
    testDatabaseName: string;
};
export declare const createTestRunner: (PgPool: new (poolConfig: PoolConfig) => PgPoolType, name: string) => {
    test: TestFn<TestContextType>;
};
export declare const createIntegrationTests: (test: TestFn<TestContextType>, PgPool: new () => PgPoolType) => void;
export {};
//# sourceMappingURL=createIntegrationTests.d.ts.map