export type ParserTransformation = (state: ParserState) => ParserState;

export type ParserResult = String | String[] | null;
export interface ParserState {
  target: string;
  index: number;
  result: ParserResult;
  isError: boolean | null;
  error: string | null;
}
