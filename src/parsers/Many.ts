import { updateParserError, errors, updateParserResult } from '../utils';
import { Parser } from './Parser';
import { ParserState } from '../interfaces';

/**
 * Parser for parsing input consisting of potentially many instances
 * of a particular constituent
 *
 * @param parser parser to apply to target input
 * @returns function to take input and pass to parser
 */
export const many = (parser: Parser) =>
  new Parser((parserState: ParserState) => {
    // Stop parsing if passed a state containing error
    if (parserState.isError) {
      return parserState;
    }

    // Initialize state
    let nextState = parserState;
    const results = [];
    let done = false;

    // Apply parser to target input until an error is encountered
    while (!done) {
      let errorFreeState = parser.stateTransformer(nextState);

      if (!errorFreeState.isError) {
        results.push(errorFreeState.result);

        // Ensure `nextState` never contains an error of its child parsers
        nextState = errorFreeState;
      } else {
        done = true;
      }
    }

    return updateParserResult(nextState, results);
  });
