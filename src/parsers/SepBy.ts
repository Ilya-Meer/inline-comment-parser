import { updateParserResult } from '../utils/utils';
import { Parser } from './Parser';
import { ParserState } from '../interfaces';

/**
 * Parser for parsing many instances of an input separated by some element
 *
 * @param parser parser to apply to target input
 * @returns curried function that takes value parser and returns
 * another function which takes actual value to parse
 */
export const sepBy = (separatorParser: Parser) => (valueParser: Parser) =>
  new Parser(
    (parserState: ParserState): ParserState => {
      if (parserState.isError) {
        return parserState;
      }

      const results = [];
      let nextState = parserState;

      while (true) {
        let errorFreeState = valueParser.stateTransformer(nextState);

        if (errorFreeState.isError) {
          break;
        }

        // Keep track of value parser's result
        results.push(errorFreeState.result);

        // Ensure `nextState` never contains an error
        nextState = errorFreeState;

        const separatorState = separatorParser.stateTransformer(nextState);

        if (separatorState.isError) {
          break;
        }

        nextState = separatorState;
      }

      // Ignore separator state result, only capture value parser result
      return updateParserResult(nextState, results);
    }
  );
