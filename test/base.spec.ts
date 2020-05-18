import { Parser } from '../src/parsers/Parser';
import { ParserState } from '../src/interfaces';

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
});
