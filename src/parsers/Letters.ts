import { Parser } from './Parser';
import { ParserState } from '../interfaces';
import { updateParserError, errors, updateParserState } from '../utils';

const lettersRegex = /^[a-zA-Z]+/;

/**
 * Parser for parsing letters
 */
export const letters = new Parser((parserState: ParserState) => {
  const { target, index, isError } = parserState;

  // Return error if passed-in state contains uncaught error
  if (isError) {
    return updateParserError(parserState, parserState.error!);
  }

  // Get input up to currently parsed index
  const targetString = target.slice(index);

  if (!targetString.length) {
    return updateParserError(parserState, errors.genericEndOfInput('letters'));
  }

  const matched = targetString.match(lettersRegex);

  if (!matched) {
    return updateParserError(
      parserState,
      errors.genericParsingError('letters', index)
    );
  }

  return updateParserState(parserState, index + matched[0].length, matched[0]);
});
