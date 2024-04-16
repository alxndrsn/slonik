"use strict";
/**
 * Functions in this file are never actually run - they are purely
 * a type-level tests to ensure the typings don't regress.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryMethods = void 0;
const _1 = require(".");
const expect_type_1 = require("expect-type");
const zod_1 = require("zod");
const ZodRow = zod_1.z.object({
    bar: zod_1.z.boolean(),
    foo: zod_1.z.string(),
});
const queryMethods = async () => {
    const client = await (0, _1.createPool)('');
    const sql = (0, _1.createSqlTag)({
        typeAliases: {
            row: ZodRow,
        },
    });
    // parser
    const parser = sql.type(ZodRow) ``.parser;
    (0, expect_type_1.expectTypeOf)(parser).toEqualTypeOf();
    // any
    const any = await client.any(sql.unsafe ``);
    (0, expect_type_1.expectTypeOf)(any).toEqualTypeOf();
    const anyZodTypedQuery = await client.any(sql.type(ZodRow) ``);
    (0, expect_type_1.expectTypeOf)(anyZodTypedQuery).toEqualTypeOf();
    const anyZodAliasQuery = await client.any(sql.typeAlias('row') ``);
    (0, expect_type_1.expectTypeOf)(anyZodAliasQuery).toEqualTypeOf();
    // anyFirst
    const anyFirst = await client.anyFirst(sql.unsafe ``);
    (0, expect_type_1.expectTypeOf)(anyFirst).toEqualTypeOf();
    const anyFirstZodTypedQuery = await client.anyFirst(sql.type(ZodRow) ``);
    (0, expect_type_1.expectTypeOf)(anyFirstZodTypedQuery).toEqualTypeOf();
    // many
    const many = await client.many(sql.unsafe ``);
    (0, expect_type_1.expectTypeOf)(many).toEqualTypeOf();
    const manyZodTypedQuery = await client.many(sql.type(ZodRow) ``);
    (0, expect_type_1.expectTypeOf)(manyZodTypedQuery).toEqualTypeOf();
    // manyFirst
    const manyFirst = await client.manyFirst(sql.unsafe ``);
    (0, expect_type_1.expectTypeOf)(manyFirst).toEqualTypeOf();
    const manyFirstZodTypedQuery = await client.manyFirst(sql.type(ZodRow) ``);
    (0, expect_type_1.expectTypeOf)(manyFirstZodTypedQuery).toEqualTypeOf();
    // maybeOne
    const maybeOne = await client.maybeOne(sql.unsafe ``);
    (0, expect_type_1.expectTypeOf)(maybeOne).toEqualTypeOf();
    const maybeOneZodTypedQuery = await client.maybeOne(sql.type(ZodRow) ``);
    (0, expect_type_1.expectTypeOf)(maybeOneZodTypedQuery).toEqualTypeOf();
    // maybeOneFirst
    const maybeOneFirst = await client.maybeOneFirst(sql.unsafe ``);
    (0, expect_type_1.expectTypeOf)(maybeOneFirst).toEqualTypeOf();
    const maybeOneFirstZodTypedQuery = await client.maybeOneFirst(sql.type(ZodRow) ``);
    (0, expect_type_1.expectTypeOf)(maybeOneFirstZodTypedQuery).toEqualTypeOf();
    // one
    const one = await client.one(sql.unsafe ``);
    (0, expect_type_1.expectTypeOf)(one).toEqualTypeOf();
    const oneZodTypedQuery = await client.one(sql.type(ZodRow) ``);
    (0, expect_type_1.expectTypeOf)(oneZodTypedQuery).toEqualTypeOf();
    // oneFirst
    const oneFirst = await client.oneFirst(sql.unsafe ``);
    (0, expect_type_1.expectTypeOf)(oneFirst).toEqualTypeOf();
    const oneFirstZodTypedQuery = await client.oneFirst(sql.type(ZodRow) ``);
    (0, expect_type_1.expectTypeOf)(oneFirstZodTypedQuery).toEqualTypeOf();
    // query
    const query = await client.query(sql.unsafe ``);
    (0, expect_type_1.expectTypeOf)(query).toMatchTypeOf();
    const queryZodTypedQuery = await client.query(sql.type(ZodRow) ``);
    (0, expect_type_1.expectTypeOf)(queryZodTypedQuery).toMatchTypeOf();
    const FooBarRow = zod_1.z.object({
        x: zod_1.z.string(),
        y: zod_1.z.number(),
    });
    (0, expect_type_1.expectTypeOf)(await client.one(sql.type(FooBarRow) `select 'x' x, 123 y`)).toEqualTypeOf();
    (0, expect_type_1.expectTypeOf)(await client.any(sql.type(FooBarRow) `select 'x' x, 123 y`)).toEqualTypeOf();
};
exports.queryMethods = queryMethods;
//# sourceMappingURL=types.test.js.map