import { str } from '../src/parsers/Str';

describe('String Parser', () => {
  it('parses strings correctly', () => {
    const parser = str('hello');

    const parsed = parser.run('hello');

    expect(parsed).toEqual({
      target: 'hello',
      index: 5,
      result: 'hello',
      error: null,
      isError: false,
    });
  });

  it('returns a parsing error if unable to match target input', () => {
    const parser = str('hello');

    const parsed = parser.run('some other string');

    expect(parsed).toEqual({
      target: 'some other string',
      index: 0,
      result: null,
      error: "str: Tried to match 'hello' but got 'some other string' instead",
      isError: true,
    });
  });

  it('returns an end of input error if running out of input', () => {
    const parser = str('hello');

    const parsed = parser.run('');

    expect(parsed).toEqual({
      target: '',
      index: 0,
      result: null,
      error: "str: Tried to match 'hello' but got unexepected end of input",
      isError: true,
    });
  });
});
