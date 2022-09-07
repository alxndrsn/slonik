import type { PrimitiveValueExpressionType, SqlTaggedTemplateType } from '../types';
export declare const createSqlTag: <T = Record<string, PrimitiveValueExpressionType>>() => SqlTaggedTemplateType<T>;
