import { Parser } from './Parser';
import { ParserState } from '../interfaces';
import { updateParserError, errors, updateParserState } from '../utils';

/**
 * Parser for parsing strings
 *
 * @param {string} s string to match
 * @returns function to take in string and attempt to match `s`
 */
export const str = (s: string) =>
  new Parser((parserState: ParserState) => {
    const { target, index, isError } = parserState;

    // Return error if passed-in state contains uncaught error
    if (isError) {
      return updateParserError(parserState, parserState.error!);
    }

    // Get input up to currently parsed index
    const targetString = target.slice(index);

    if (!targetString.length) {
      return updateParserError(parserState, errors.endOfStringInput(s));
    }

    if (!targetString.startsWith(s)) {
      return updateParserError(
        parserState,
        errors.stringParsingError(s, targetString)
      );
    }

    return updateParserState(parserState, index + s.length, s);
  });
