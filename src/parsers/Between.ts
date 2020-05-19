import { Parser } from './Parser';
import { sequenceOf } from './SequenceOf';

/**
 * Utility parser for parsing input between other elements
 *
 * @param leftParser parser for parsing left element
 * @param rightParser parser for parsing right element
 * @returns function accepting content parser with which to parse
 * content between two elements
 */
export const between = (leftParser: Parser, rightParser: Parser) => (
  contentParser: Parser
) =>
  sequenceOf([leftParser, contentParser, rightParser]).map(
    (results) => results[1]
  );
