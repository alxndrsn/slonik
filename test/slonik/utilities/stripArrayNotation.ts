import { stripArrayNotation } from '../../../src/utilities/stripArrayNotation';
import test from 'ava';

test('strips array notation', (t) => {
  t.is(stripArrayNotation('foo'), 'foo');
  t.is(stripArrayNotation('foo[]'), 'foo');
  t.is(stripArrayNotation('foo[][]'), 'foo');
});
