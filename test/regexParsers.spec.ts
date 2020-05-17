import { letters } from '../src/parsers/Letters';
import { digits } from '../src/parsers/Digits';
import { whitespace } from '../src/parsers/Whitespace';
import { sequenceOf } from '../src/parsers/SequenceOf';

describe('Regex Parsers', () => {
  it('parses input correctly', () => {
    let parsed = letters.run('hello1234');

    expect(parsed).toEqual({
      target: 'hello1234',
      index: 5,
      result: 'hello',
      error: null,
      isError: false,
    });

    parsed = digits.run('123456789');

    expect(parsed).toEqual({
      target: '123456789',
      index: 9,
      result: '123456789',
      error: null,
      isError: false,
    });

    parsed = whitespace.run(' \n    \t   ');

    expect(parsed).toEqual({
      target: ' \n    \t   ',
      index: 10,
      result: ' \n    \t   ',
      error: null,
      isError: false,
    });
  });

  it('returns a parsing error if unable to match target input', () => {
    let parsed = letters.run('1234');

    expect(parsed).toEqual({
      target: '1234',
      index: 0,
      result: null,
      error: 'letters: unable to match letters at index 0',
      isError: true,
    });

    parsed = digits.run('hello');

    expect(parsed).toEqual({
      target: 'hello',
      index: 0,
      result: null,
      error: 'digits: unable to match digits at index 0',
      isError: true,
    });

    parsed = whitespace.run('world');

    expect(parsed).toEqual({
      target: 'world',
      index: 0,
      result: null,
      error: 'whitespace: unable to match whitespace at index 0',
      isError: true,
    });
  });

  it('returns an end of input error if running out of input', () => {
    const parsed = whitespace.run('');

    expect(parsed).toEqual({
      target: '',
      index: 0,
      result: null,
      error: 'whitespace: unexpected end of input',
      isError: true,
    });
  });

  it('can be combined in sequence', () => {
    const sequence = sequenceOf([digits, letters, digits, whitespace, digits]);

    const parsed = sequence.run('234asdf456   999');

    expect(parsed).toEqual({
      target: '234asdf456   999',
      index: 16,
      result: ['234', 'asdf', '456', '   ', '999'],
      error: null,
      isError: false,
    });
  });
});
