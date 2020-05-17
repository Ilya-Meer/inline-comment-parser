import { ParserTransformation } from '../interfaces';

/**
 * Base class for creating parsers
 */
export class Parser {
  // Specific function for transforming received parser state
  public stateTransformer: ParserTransformation;

  constructor(stateTransformer: ParserTransformation) {
    this.stateTransformer = stateTransformer;
  }

  public run(target: string) {
    const initialState = {
      target,
      index: 0,
      result: null,
      error: null,
      isError: false,
    };

    return this.stateTransformer(initialState);
  }
}
