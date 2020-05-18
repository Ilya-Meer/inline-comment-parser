import { Parser } from '../src/parsers/Parser';
import { ParserState } from '../src/interfaces';
import { str } from '../src/parsers/Str';

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
      // @ts-ignore
    }).map((result) => result.split('').reverse().join('').toUpperCase());

    const parsed = parser.run('hello');

    expect(parsed).toEqual({
      ...dummyReturnState,
      result: 'TLUSER',
    });
  });
});
