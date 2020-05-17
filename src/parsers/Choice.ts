import { updateParserError, errors } from '../utils';
import { Parser } from './Parser';
import { ParserState } from '../interfaces';

/**
 * Parser for parsing input with one of many provided parsers
 *
 * @param parsers array of parsers to apply to target input
 * @returns function to take input and pass to parser sequence
 */
export const choice = (parsers: Parser[]) =>
  new Parser((parserState: ParserState) => {
    // Stop parsing if passed a state containing error
    if (parserState.isError) {
      return parserState;
    }

    // Apply each parser in array to target input until one succeeds
    for (let p of parsers) {
      const nextState = p.stateTransformer(parserState);

      if (!nextState.isError) {
        return nextState;
      }
    }

    return updateParserError(
      parserState,
      errors.choiceParsingError(parserState.index)
    );
  });
