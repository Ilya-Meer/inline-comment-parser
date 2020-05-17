import { updateParserResult } from '../utils';
import { Parser } from './Parser';
import { ParserState } from '../interfaces';

/**
 * Parser for executing a sequence of parsers
 *
 * @param parsers array of parsers to chain together
 * @returns function to take input and pass to parser sequence
 */
export const sequenceOf = (parsers: Parser[]) =>
  new Parser((parserState: ParserState) => {
    // Stop parsing if passed a state containing error
    if (parserState.isError) {
      return parserState;
    }

    const results = [];
    let nextState = parserState;
    // Apply each parser in array to target input
    for (let p of parsers) {
      nextState = p.stateTransformer(nextState);

      if (nextState.isError) {
        return nextState;
      }

      if (nextState.result) {
        results.push(nextState.result);
      }
    }

    return updateParserResult(nextState, results);
  });
