import { between } from '../src/parsers/Between';
import { letters } from '../src/parsers/Letters';
import { whitespace } from '../src/parsers/Whitespace';
import { str } from '../src/parsers/Str';
import { sequenceOf } from '../src/parsers/SequenceOf';

describe('Between Parser', () => {
  it('parses input correctly', () => {
    const openBrace = str('{');
    const closeBrace = str('}');

    let braceParser = between(openBrace, closeBrace)(letters);

    let parsed = braceParser.run('{abcdef}');

    expect(parsed).toEqual({
      target: '{abcdef}',
      index: 8,
      result: 'abcdef',
      error: null,
      isError: false,
    });

    const contentWithWhitespace = sequenceOf([
      whitespace,
      str('I am some content'),
      whitespace,
    ]);

    braceParser = between(
      openBrace,
      closeBrace
    )(contentWithWhitespace).map((results) =>
      results.filter((result: string) => result.trim().length)
    );

    parsed = braceParser.run('{      I am some content    }');

    expect(parsed).toEqual({
      target: '{      I am some content    }',
      index: 29,
      result: ['I am some content'],
      error: null,
      isError: false,
    });
  });

  it('returns a parsing error if unable to match target input', () => {
    const openBrace = str('{');
    const closeBrace = str('}');

    let braceParser = between(openBrace, closeBrace)(letters);

    let parsed = braceParser.run('{abcd');

    expect(parsed).toEqual({
      target: '{abcd',
      index: 5,
      result: 'abcd',
      error: "str: Tried to match '}' but got unexepected end of input",
      isError: true,
    });

    parsed = braceParser.run('abcd}');

    expect(parsed).toEqual({
      target: 'abcd}',
      index: 0,
      result: null,
      error: "str: Tried to match '{' but got 'abcd}' instead",
      isError: true,
    });
  });
});
