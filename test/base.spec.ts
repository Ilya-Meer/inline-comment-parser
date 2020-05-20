import { Parser } from '../src/parsers/Parser';
import { ParserState } from '../src/interfaces';
import { str } from '../src/parsers/Str';
import { letters } from '../src/parsers/Letters';

describe('Base Parser Class', () => {
  it('calls run method with passed in state transformer', () => {
    const dummyReturnState = {
      target: 'target',
      index: 1,
      result: 'result',
      isError: false,
      error: null,
    };

    const parser = new Parser((state: ParserState) => {
      return dummyReturnState;
    });

    const parsed = parser.run('hello');

    expect(parsed).toEqual(dummyReturnState);
  });

  it('returns result transformed by map function if one is specified', () => {
    const dummyReturnState = {
      target: 'target',
      index: 1,
      result: 'result',
      isError: false,
      error: null,
    };

    const parser = new Parser((state: ParserState) => {
      return dummyReturnState;
    }).map((result) => result.split('').reverse().join('').toUpperCase());

    const parsed = parser.run('hello');

    expect(parsed).toEqual({
      ...dummyReturnState,
      result: 'TLUSER',
    });
  });

  it('returns error transformed by errorMap function if one is specified', () => {
    const dummyReturnState = {
      target: 'target',
      index: 0,
      result: 'result',
      isError: true,
      error: 'unable to parse target input',
    };

    const parser = new Parser((state: ParserState) => {
      return dummyReturnState;
    }).errorMap(
      (error, index) =>
        `The parser encountered an error: '${error}' at index: ${index}`
    );

    const parsed = parser.run('hello');

    expect(parsed).toEqual({
      ...dummyReturnState,
      error: `The parser encountered an error: 'unable to parse target input' at index: 0`,
    });
  });

  it('returns new parser depending on previous parser if a chain function is specified', () => {
    let parser = letters.chain((res) => {
      if (res[0] === 'a') {
        return str('1');
      } else {
        return str('2');
      }
    });

    let parsed = parser.run('a1');

    parsed = parser.run('a1');

    expect(parsed).toEqual({
      target: 'a1',
      index: 2,
      result: '1',
      isError: false,
      error: null,
    });

    parsed = parser.run('a2');

    expect(parsed).toEqual({
      target: 'a2',
      index: 1,
      result: 'a',
      isError: true,
      error: "str: Tried to match '1' but got '2' instead",
    });

    parsed = parser.run('b2');

    expect(parsed).toEqual({
      target: 'b2',
      index: 2,
      result: '2',
      isError: false,
      error: null,
    });
  });
});
