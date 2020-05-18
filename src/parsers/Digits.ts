import { Parser } from './Parser';
import { ParserState } from '../interfaces';
import { updateParserError, errors, updateParserState } from '../utils';

const digitsRegex = /^[0-9]+/;

/**
 * Parser for parsing digits
 */
export const digits = new Parser(
  (parserState: ParserState): ParserState => {
    const { target, index, isError } = parserState;

    // Return error if passed-in state contains uncaught error
    if (isError) {
      return updateParserError(parserState, parserState.error!);
    }

    // Get input up to currently parsed index
    const targetString = target.slice(index);

    if (!targetString.length) {
      return updateParserError(parserState, errors.genericEndOfInput('digits'));
    }

    const matched = targetString.match(digitsRegex);

    if (!matched) {
      return updateParserError(
        parserState,
        errors.genericParsingError('digits', index)
      );
    }

    return updateParserState(
      parserState,
      index + matched[0].length,
      matched[0]
    );
  }
);
