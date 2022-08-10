import type { JsonBinarySqlToken, JsonSqlToken, SqlFragment } from '../types';
export declare const createJsonSqlFragment: (token: JsonBinarySqlToken | JsonSqlToken, greatestParameterPosition: number, binary: boolean) => SqlFragment;
