export type ParserTransformation = (state: ParserState) => ParserState;

export interface ParserState {
  target: string;
  index: number;
  result: String[] | null;
  isError: boolean | null;
  error: string | null;
}
