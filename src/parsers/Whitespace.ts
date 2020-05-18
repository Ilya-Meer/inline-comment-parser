import { Parser } from './Parser';
import { ParserState } from '../interfaces';
import { updateParserError, errors, updateParserState } from '../utils';

const whitespaceRegex = /^\s+/;

/**
 * Parser for parsing whitespace
 */
export const whitespace = new Parser(
  (parserState: ParserState): ParserState => {
    const { target, index, isError } = parserState;

    // Return error if passed-in state contains uncaught error
    if (isError) {
      return updateParserError(parserState, parserState.error!);
    }

    // Get input up to currently parsed index
    const targetString = target.slice(index);

    if (!targetString.length) {
      return updateParserError(
        parserState,
        errors.genericEndOfInput('whitespace')
      );
    }

    const matched = targetString.match(whitespaceRegex);

    if (!matched) {
      return updateParserError(
        parserState,
        errors.genericParsingError('whitespace', index)
      );
    }

    return updateParserState(
      parserState,
      index + matched[0].length,
      matched[0]
    );
  }
);
