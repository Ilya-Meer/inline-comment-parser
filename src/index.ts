import fs from 'fs';
import glob from 'glob';
import { getIdentifierInfo, processFile } from './utils/commentParsingUtils';
import { EnhancedComment, ParsedComment } from './interfaces';

/**
 * Parse a comment string and extract content of comments
 * as well as information about identifier described by comment
 * if such an identifier exists
 * @param commentString Comment string to parse
 * @param delimiter Delimiter to mark a string as a comment
 * @returns Object with file name and array of parsed comments
 */

/**
 * @param pattern Glob pattern to generate paths
 * for files to parse
 * @param delimiter Delimiter to mark a string as a comment
 */
export const parseFiles = (
  pattern: string,
  delimiter: string = '///'
): EnhancedComment[] => {
  if (!pattern) {
    throw new Error('No pattern argument provided!');
  }

  if (typeof pattern !== 'string') {
    throw new Error(
      "Expected a pattern of type 'string' but received a non-string type"
    );
  }

  if (typeof delimiter !== 'string') {
    throw new Error(
      "Expected a delimiter of type 'string' but received a non-string type"
    );
  }

  // Get files matching glob pattern
  const files = glob.sync(pattern);

  // Initialize array to hold parsed values
  const parsed = [];

  for (let file of files) {
    // Read file into memory
    const currentFile = fs.readFileSync(file, { encoding: 'utf-8' });
    // Store array of lines for later use
    const lines = currentFile.split('\n');

    // Extract raw comment text
    const comments = processFile(currentFile, delimiter);

    const withIdentifierInfo = [];

    for (let comment of comments) {
      // Fetch identifier info for comments
      withIdentifierInfo.push(getIdentifierInfo(comment, lines));
    }

    const parsedCommentObject = {
      file,
      comments: withIdentifierInfo,
    };

    parsed.push(parsedCommentObject);
  }

  return parsed;
};

/**
 * Parse a comment string and extract content of comments
 * as well as information about identifier described by comment
 * if such an identifier exists
 * @param commentString Comment string to parse
 * @param delimiter Delimiter to mark a string as a comment
 * @returns Comment string with additional context
 */
export const parseComment = (
  commentString: string,
  delimiter: string = '///'
): ParsedComment => {
  if (!commentString) {
    throw new Error('No pattern argument provided!');
  }

  if (typeof commentString !== 'string') {
    throw new Error(
      "Expected a comment string of type 'string' but received a non-string type"
    );
  }

  if (typeof delimiter !== 'string') {
    throw new Error(
      "Expected a delimiter of type 'string' but received a non-string type"
    );
  }

  // Extract raw comment text
  const [comment] = processFile(commentString, delimiter);

  const lines = commentString.split('\n');

  // Fetch identifier info for comments
  const withIdentifierInfo = getIdentifierInfo(comment, lines);

  return withIdentifierInfo;
};
