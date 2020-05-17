import { sequenceOf } from '../src/parsers/SequenceOf';
import { str } from '../src/parsers/Str';

describe('SequenceOf Parser', () => {
  it('parses input correctly', () => {
    const str1 = str('lorem ipsum');
    const str2 = str(' dolor sit amet');

    const parser = sequenceOf([str1, str2]);

    const parsed = parser.run('lorem ipsum dolor sit amet');

    expect(parsed).toEqual({
      target: 'lorem ipsum dolor sit amet',
      index: 26,
      result: ['lorem ipsum', ' dolor sit amet'],
      error: null,
      isError: false,
    });
  });

  it('returns a parsing error if unable to match target input', () => {
    const str1 = str('lorem ipsum');
    const str2 = str(' dolor sit amet');

    const parser = sequenceOf([str1, str2]);

    const parsed = parser.run('some other string');

    expect(parsed).toEqual({
      target: 'some other string',
      index: 0,
      result: null,
      error:
        "str: Tried to match 'lorem ipsum' but got 'some other string' instead",
      isError: true,
    });
  });

  it('returns error of child parser', () => {
    const str1 = str('lorem ipsum');
    const str2 = str(' dolor sit amet');

    const parser = sequenceOf([str1, str2]);

    const parsed = parser.run('lorem ipsum');

    expect(parsed).toEqual({
      target: 'lorem ipsum',
      index: 11,
      result: 'lorem ipsum',
      error:
        "str: Tried to match ' dolor sit amet' but got unexepected end of input",
      isError: true,
    });
  });
});
