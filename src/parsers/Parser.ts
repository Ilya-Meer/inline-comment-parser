import { ParserTransformation, ParserState, ParserResult } from '../interfaces';
import { updateParserResult } from '../utils';

/**
 * Base class for creating parsers
 */
export class Parser {
  // Specific function for transforming received parser state
  public stateTransformer: ParserTransformation;

  constructor(stateTransformer: ParserTransformation) {
    this.stateTransformer = stateTransformer;
  }

  public run(target: string): ParserState {
    const initialState = {
      target,
      index: 0,
      result: null,
      error: null,
      isError: false,
    };

    return this.stateTransformer(initialState);
  }

  public map(fn: (stateResult: ParserResult) => ParserResult) {
    return new Parser((parserState: ParserState) => {
      const nextState = this.stateTransformer(parserState);
      return updateParserResult(nextState, fn(nextState.result));
    });
  }
}
