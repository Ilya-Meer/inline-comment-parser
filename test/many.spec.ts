/**
 * Start testing Many Parser Here
 */

import { choice } from '../src/parsers/Choice';
import { str } from '../src/parsers/Str';
import { digits } from '../src/parsers/Digits';
import { letters } from '../src/parsers/Letters';
import { sequenceOf } from '../src/parsers/SequenceOf';
import { many } from '../src/parsers/Many';

describe('Many Parser', () => {
  it('parses input correctly', () => {
    const stringParser = str('lorem ipsum');

    let parser = many(stringParser);

    let parsed = parser.run('lorem ipsumlorem ipsumlorem ipsum');

    expect(parsed).toEqual({
      target: 'lorem ipsumlorem ipsumlorem ipsum',
      index: 33,
      result: ['lorem ipsum', 'lorem ipsum', 'lorem ipsum'],
      error: null,
      isError: false,
    });

    parser = many(choice([letters, digits]));

    parsed = parser.run('a1b2c3d4');

    expect(parsed).toEqual({
      target: 'a1b2c3d4',
      index: 8,
      result: ['a', '1', 'b', '2', 'c', '3', 'd', '4'],
      error: null,
      isError: false,
    });
  });

  it('returns existing state if unable to match target input', () => {
    const stringParser = str('lorem ipsum');

    let parser = many(stringParser);

    let parsed = parser.run('lorem');

    expect(parsed).toEqual({
      target: 'lorem',
      index: 0,
      result: [],
      error: null,
      isError: false,
    });

    parser = sequenceOf([stringParser, many(stringParser)]);

    parsed = parser.run('lorem ipsum123456789');

    expect(parsed).toEqual({
      target: 'lorem ipsum123456789',
      index: 11,
      result: ['lorem ipsum', []],
      error: null,
      isError: false,
    });
  });
});
