/**
 * Start testing Many Parser Here
 */

import { choice } from '../src/parsers/Choice';
import { between } from '../src/parsers/Between';
import { str } from '../src/parsers/Str';
import { letters } from '../src/parsers/Letters';
import { digits } from '../src/parsers/Digits';
import { sepBy } from '../src/parsers/SepBy';
import { lazy } from '../src/utils';
import { whitespace } from '../src/parsers/Whitespace';
import { sequenceOf } from '../src/parsers/SequenceOf';

describe('SepBy Parser', () => {
  it('parses input correctly', () => {
    const separatorParser = sepBy(str(','));

    let parser = separatorParser(letters);

    let parsed = parser.run('foo,bar,a,b,c');

    expect(parsed).toEqual({
      target: 'foo,bar,a,b,c',
      index: 13,
      result: ['foo', 'bar', 'a', 'b', 'c'],
      error: null,
      isError: false,
    });

    const betweenSquareBrackets = between(str('['), str(']'));

    parser = betweenSquareBrackets(separatorParser(letters));

    parsed = parser.run('[a,b,c,d,e,f]');

    expect(parsed).toEqual({
      target: '[a,b,c,d,e,f]',
      index: 13,
      result: ['a', 'b', 'c', 'd', 'e', 'f'],
      error: null,
      isError: false,
    });

    const recursiveLetterArrayParser = lazy(() =>
      choice([letters, letterArrayParser])
    );

    const letterArrayParser = betweenSquareBrackets(
      separatorParser(recursiveLetterArrayParser)
    );

    parsed = recursiveLetterArrayParser.run('[a,b,[c,[d]],e,f]');

    expect(parsed).toEqual({
      target: '[a,b,[c,[d]],e,f]',
      index: 17,
      result: ['a', 'b', ['c', ['d']], 'e', 'f'],
      error: null,
      isError: false,
    });
  });

  it('returns existing state if unable to match target input', () => {
    let commaSeparated = sepBy(str(','))(digits);

    let parsed = commaSeparated.run('1,2,');

    expect(parsed).toEqual({
      target: '1,2,',
      index: 4,
      result: ['1', '2'],
      error: null,
      isError: false,
    });

    commaSeparated = sepBy(str(','))(letters);

    parsed = commaSeparated.run('1,2,3');

    expect(parsed).toEqual({
      target: '1,2,3',
      index: 0,
      result: [],
      error: null,
      isError: false,
    });
  });
});
