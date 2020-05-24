import { ParserState, ParserResult } from './interfaces';
import { Parser } from './parsers/Parser';

export const updateParserState = (
  state: ParserState,
  index: number,
  result: ParserResult
) => ({
  ...state,
  index,
  result,
});

export const updateParserResult = (state: ParserState, result: any) => ({
  ...state,
  result,
});

export const updateParserError = (
  state: ParserState,
  errorMessage: string
) => ({
  ...state,
  isError: true,
  error: errorMessage,
});

export const errors = {
  endOfStringInput: (target: string) =>
    `str: Tried to match '${target}' but got unexepected end of input`,
  genericEndOfInput: (parserName: string) =>
    `${parserName}: unexpected end of input`,
  genericParsingError: (parserName: string, index: number) =>
    `${parserName}: unable to match ${parserName} at index ${index}`,
  stringParsingError: (target: string, result: string) =>
    `str: Tried to match '${target}' but got '${result}' instead`,
  choiceParsingError: (index: number) =>
    `choice: unable to match with any parser at index ${index}`,
};

export const lazy = (parserThunk: () => Parser): Parser =>
  new Parser((parserState: ParserState) => {
    const parser = parserThunk();
    const nextState = parser.stateTransformer(parserState);

    return nextState;
  });
