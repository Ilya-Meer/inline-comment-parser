import { ParserTransformation, ParserState } from '../interfaces';
import { updateParserResult, updateParserError } from '../utils/utils';

/**
 * Base class for creating parsers
 */
export class Parser {
  // Specific function for transforming received parser state
  public stateTransformer: ParserTransformation;

  constructor(stateTransformer: ParserTransformation) {
    this.stateTransformer = stateTransformer;
  }

  // Apply parser to target string
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

  // Apply passed in function to result of previous parser
  public map(fn: (stateResult: any) => any) {
    return new Parser((parserState: ParserState) => {
      const nextState = this.stateTransformer(parserState);

      if (nextState.isError) {
        return nextState;
      }

      return updateParserResult(nextState, fn(nextState.result));
    });
  }

  public discard() {
    return new Parser((parserState: ParserState) => {
      const nextState = this.stateTransformer(parserState);

      if (nextState.isError) {
        return nextState;
      }

      return updateParserResult(nextState, undefined);
    });
  }

  // Apply passed in function to error of previous parser
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

  // Generate next parser depending on state of previous parser
  public chain(fn: (stateResult: any) => Parser) {
    return new Parser((parserState: ParserState) => {
      const nextState = this.stateTransformer(parserState);

      if (nextState.isError) {
        return nextState;
      }

      const nextParser = fn(nextState.result);

      return nextParser.stateTransformer(nextState);
    });
  }
}
