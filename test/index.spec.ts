import path from 'path';
import { parseFiles, parseComment } from '../src/index';

describe('Comment Parser', () => {
  describe('Comment string parsing functionality', () => {
    it('parses a comment string properly', () => {
      const commentString = `
      /// Here is a comment one one line followed
      /// by a second line and
      /// then by a third!
      `;

      const parsed = parseComment(commentString);

      expect(parsed).toEqual({
        content:
          'Here is a comment one one line followed by a second line and then by a third!',
        source: { lineNumber: 2 },
      });
    });

    it('accepts a custom delimiter', () => {
      let commentString = `
      // TODO: Refactor this class
      // TODO: to parse more widgets.
      `;

      let parsed = parseComment(commentString, '// TODO:');

      expect(parsed).toEqual({
        content: 'Refactor this class to parse more widgets.',
        source: { lineNumber: 2 },
      });
    });

    it('adds context if possible', () => {
      let commentString = `
      // TODO: Refactor this class
      // TODO: to parse more widgets.
      class TestClass
      `;

      let parsed = parseComment(commentString, '// TODO:');

      expect(parsed).toEqual({
        content: 'Refactor this class to parse more widgets.',
        source: { lineNumber: 2, name: 'TestClass', type: 'class' },
      });

      commentString = `/// Comment here
      get prop() {}
      `;

      parsed = parseComment(commentString);

      expect(parsed).toEqual({
        content: 'Comment here',
        source: { lineNumber: 1, name: 'prop', type: 'getter' },
      });
    });

    it('throws an error if comment string argument is not a string', () => {
      expect(() => {
        // @ts-ignore
        parseComment(123456, '// TODO:');
      }).toThrowError(
        "Expected a comment string of type 'string' but received a non-string type"
      );
    });

    it('throws an error if pattern argument is not provided', () => {
      expect(() => {
        // @ts-ignore
        parseComment();
      }).toThrowError('No pattern argument provided!');
    });

    it('throws an error if delimiter argument is not a string', () => {
      let commentString = `
      // TODO: Refactor this class
      // TODO: to parse more widgets.
      class TestClass
      `;

      expect(() => {
        // @ts-ignore
        parseComment(commentString, null);
      }).toThrowError(
        "Expected a delimiter of type 'string' but received a non-string type"
      );
    });
  });

  describe('File array parsing functionality', () => {
    it('parses an array of files and returns comments where found', () => {
      const pattern = path.join(__dirname, './fixtures/*.js');

      const parsed = parseFiles(pattern);

      expect(parsed.length).toEqual(2);

      expect(path.basename(parsed[0].file)).toEqual('multipleComments.js');
      expect(path.basename(parsed[1].file)).toEqual('singleComment.js');

      expect(parsed[0].comments).toEqual([
        {
          content: 'This is a comment at the beginning of the file',
          source: {
            type: 'class',
            name: 'DummyClass',
            lineNumber: 1,
          },
        },
        {
          content:
            "Here's a comment that won't be accompanied by any identifier information",
          source: {
            lineNumber: 5,
          },
        },
        {
          content: "This here's a method",
          source: {
            type: 'method',
            name: 'greet',
            lineNumber: 11,
          },
        },
      ]);

      expect(parsed[1].comments).toEqual([
        {
          content:
            'This is a single comment Documenting the constructor With some useful information',
          source: {
            lineNumber: 2,
            type: 'constructor',
          },
        },
      ]);
    });

    it('returns an empty array if pattern did not resolve any files', () => {
      const pattern = path.join(__dirname, './foo/*.bar');

      const parsed = parseFiles(pattern);

      expect(Array.isArray(parsed)).toEqual(true);
      expect(parsed.length).toEqual(0);
    });

    it('throws an error if pattern argument is not a string', () => {
      expect(() => {
        // @ts-ignore
        parseFiles(123456, '// TODO:');
      }).toThrowError(
        "Expected a pattern of type 'string' but received a non-string type"
      );
    });

    it('throws an error if pattern argument is not provided', () => {
      const pattern = path.join(__dirname, './foo/*.bar');

      expect(() => {
        // @ts-ignore
        parseFiles();
      }).toThrowError('No pattern argument provided!');
    });

    it('throws an error if delimiter argument is not a string', () => {
      const pattern = path.join(__dirname, './foo/*.bar');

      expect(() => {
        // @ts-ignore
        parseFiles(pattern, null);
      }).toThrowError(
        "Expected a delimiter of type 'string' but received a non-string type"
      );
    });
  });
});
