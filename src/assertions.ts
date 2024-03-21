import {
  SqlToken,
} from './tokens';
import type {
  SqlSqlTokenType,
} from './types';

export const assertSqlSqlToken = (subject: SqlSqlTokenType | null): void => {
  if (typeof subject !== 'object' || subject === null || subject.type !== SqlToken) {
    throw new TypeError('Query must be constructed using `sql` tagged template literal.');
  }
};
