export type ParserTransformation = (state: ParserState) => ParserState;

export interface ParserState {
  target: string;
  index: number;
  result: any;
  isError: boolean | null;
  error: string | null;
}

export interface ParsedComment {
  content: string;
  source?: {
    type: string;
    name: string;
    lineNumber: string;
  };
}

export interface EnhancedComment {
  file: string;
  comments: ParsedComment[];
}
