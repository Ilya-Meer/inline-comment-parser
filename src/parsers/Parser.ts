import { ParserTransformation, ParserState } from '../interfaces';
import { updateParserResult, updateParserError } from '../utils';

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

  public map(fn: (stateResult: any) => any) {
    return new Parser((parserState: ParserState) => {
      const nextState = this.stateTransformer(parserState);

      if (nextState.isError) {
        return nextState;
      }

      return updateParserResult(nextState, fn(nextState.result));
    });
  }

  public errorMap(fn: (error: string, index: number) => any) {
    return new Parser((parserState: ParserState) => {
      const nextState = this.stateTransformer(parserState);

      if (!nextState.isError) {
        return nextState;
      }

      return updateParserError(
        nextState,
        fn(nextState.error!, nextState.index)
      );
    });
  }
}
