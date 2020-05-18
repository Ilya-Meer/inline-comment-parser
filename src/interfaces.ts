export type ParserTransformation = (state: ParserState) => ParserState;

export type ParserResult = string | string[] | null;

export interface ParserState {
  target: string;
  index: number;
  result: ParserResult;
  isError: boolean | null;
  error: string | null;
}
