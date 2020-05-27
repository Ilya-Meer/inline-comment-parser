import { identifierParser } from './identifierParser';

/**
 * Return array of lines in given file
 * @param file File to process
 */
export const getLinesFromFile = (file: string) => file.split('\n');

/**
 * Get all text after delimiter for a given line
 * @param line Item of passed-in lines array
 * @param index Index of line in array
 * @param delimiter Separator by which to split line
 */
export const getRawCommentFromLine = (
  line: string,
  index: number,
  delimiter: string
) => {
  if (line.indexOf(delimiter) >= 0) {
    return {
      content: line.split(delimiter)[1].trim(),
      lineNumbers: [index],
    };
  }
};

/**
 * Process comments to concatenate
 * with existing comment run if one exists
 * @param acc Accumulator to collect processed comments
 * @param item Comment to process
 */
export const concatenateComments = (acc: any, item: any) => {
  const { content, lineNumbers } = item;

  const prevLineComment =
    acc.length > 0 &&
    acc.find((comment: any) => {
      const previousLineNumber = comment.lineNumbers.find(
        // Find a line number with a value
        // one less than that of the current comment
        (ln: any) => Math.abs(ln - lineNumbers[0]) === 1
      );

      if (typeof previousLineNumber === 'number') {
        return true;
      }
    });

  // If current comment is part of a run, then append to run
  if (prevLineComment) {
    prevLineComment.content += ` ${content}`;
    prevLineComment.lineNumbers.push(lineNumbers[0]);
    return acc;
  }

  // Otherwise begin a run
  acc.push({
    content,
    lineNumbers,
  });

  return acc;
};

/**
 * Driver code to extract comments from file
 * @param file File to process
 * @param delimiter Delimiter to mark a string as a comment
 */
export const processFile = (file: string, delimiter: string) =>
  getLinesFromFile(file)
    .map((line: string, index: number) =>
      getRawCommentFromLine(line, index, delimiter)
    )
    .filter((item: any) => !!item)
    .reduce(concatenateComments, [])
    .map(({ content, lineNumbers }: any) => ({
      content,
      source: {
        lineNumbers,
      },
    }));

/**
 * Extract information about identifier
 * referred to by the comment, if such an
 * identifier exists
 * @param comment Comment object
 * @param fileLines Same file lines array to search
 * for identifier information
 */
export const getIdentifierInfo = (comment: any, fileLines: string[]) => {
  const copy = Object.assign({}, comment);

  const lastCommentLine = copy.source.lineNumbers.slice(-1)[0];

  // Store line directly following comment for parsing
  const lineToParse = fileLines[lastCommentLine + 1];

  // Extract context from line following comment
  const sourceInfo = identifierParser.run(lineToParse);

  copy.source = {
    ...sourceInfo.result,
    // Add 1 since line numbers in a file start at 1
    lineNumber: copy.source.lineNumbers[0] + 1,
  };

  return copy;
};
