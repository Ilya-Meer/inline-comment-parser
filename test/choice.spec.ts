import { choice } from '../src/parsers/Choice';
import { str } from '../src/parsers/Str';
import { digits } from '../src/parsers/Digits';
import { whitespace } from '../src/parsers/Whitespace';
import { sequenceOf } from '../src/parsers/SequenceOf';

describe('Choice Parser', () => {
  it('parses input correctly', () => {
    const stringParser = str('lorem ipsum');

    const parser = choice([stringParser, whitespace, digits]);

    let parsed = parser.run('lorem ipsum dolor sit amet');

    expect(parsed).toEqual({
      target: 'lorem ipsum dolor sit amet',
      index: 11,
      result: 'lorem ipsum',
      error: null,
      isError: false,
    });

    parsed = parser.run('123');

    expect(parsed).toEqual({
      target: '123',
      index: 3,
      result: '123',
      error: null,
      isError: false,
    });

    const sequence = sequenceOf([parser, parser]);

    parsed = sequence.run('      lorem ipsum');

    expect(parsed).toEqual({
      target: '      lorem ipsum',
      index: 17,
      result: ['      ', 'lorem ipsum'],
      error: null,
      isError: false,
    });
  });

  it('returns a parsing error if unable to match target input', () => {
    const stringParser = str('lorem ipsum');

    const parser = choice([stringParser, whitespace, digits]);

    const parsed = parser.run('some other string');

    expect(parsed).toEqual({
      target: 'some other string',
      index: 0,
      result: null,
      error: 'choice: unable to match with any parser at index 0',
      isError: true,
    });
  });
});
