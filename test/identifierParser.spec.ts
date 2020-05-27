import {
  identifierParser,
  classDeclaration,
  varDeclaration,
  functionDeclaration,
  staticMemberDeclaration,
  methodDeclaration,
  getSetDeclaration,
} from '../src/utils/identifierParser';

describe('Identifier Parsers', () => {
  describe('Class declaration parser', () => {
    it('parses a comment string properly', () => {
      const commentString = `class Test {`;

      const parsed = classDeclaration.run(commentString);

      expect(parsed).toEqual({
        target: 'class Test {',
        index: 10,
        result: {
          type: 'class',
          name: 'Test',
        },
        isError: false,
        error: null,
      });
    });
  });

  describe('Variable declaration parser', () => {
    it('parses a comment string properly', () => {
      const commentString = `const foo = bar`;

      const parsed = varDeclaration.run(commentString);

      expect(parsed).toEqual({
        target: 'const foo = bar',
        index: 9,
        result: {
          type: 'variable',
          name: 'foo',
        },
        isError: false,
        error: null,
      });
    });
  });

  describe('Function declaration parser', () => {
    it('parses a comment string properly', () => {
      const commentString = `function foo() {`;

      const parsed = functionDeclaration.run(commentString);

      expect(parsed).toEqual({
        target: 'function foo() {',
        index: 12,
        result: {
          type: 'function',
          name: 'foo',
        },
        isError: false,
        error: null,
      });
    });
  });

  describe('Static member declaration parser', () => {
    it('parses a comment string properly', () => {
      const commentString = `static someMethod() {`;

      const parsed = staticMemberDeclaration.run(commentString);

      expect(parsed).toEqual({
        target: 'static someMethod() {',
        index: 17,
        result: {
          type: 'static member',
          name: 'someMethod',
        },
        isError: false,
        error: null,
      });
    });
  });

  describe('Method declaration parser', () => {
    it('parses a comment string properly', () => {
      let commentString = `someMethod() {`;

      let parsed = methodDeclaration.run(commentString);

      expect(parsed).toEqual({
        target: 'someMethod() {',
        index: 13,
        result: {
          type: 'method',
          name: 'someMethod',
        },
        isError: false,
        error: null,
      });

      commentString = `constructor(someArg) {`;

      parsed = methodDeclaration.run(commentString);

      expect(parsed).toEqual({
        target: 'constructor(someArg) {',
        index: 21,
        result: {
          type: 'constructor',
        },
        isError: false,
        error: null,
      });
    });
  });

  describe('Getter/Setter declaration parser', () => {
    it('parses a comment string properly', () => {
      let commentString = `get prop() {`;

      let parsed = getSetDeclaration.run(commentString);

      expect(parsed).toEqual({
        target: 'get prop() {',
        index: 8,
        result: {
          type: 'getter',
          name: 'prop',
        },
        isError: false,
        error: null,
      });

      commentString = `set someOtherProp {`;

      parsed = getSetDeclaration.run(commentString);

      expect(parsed).toEqual({
        target: 'set someOtherProp {',
        index: 17,
        result: {
          type: 'setter',
          name: 'someOtherProp',
        },
        isError: false,
        error: null,
      });
    });
  });

  describe('Identifier parser', () => {
    it('parses a comment string properly', () => {
      const commentString = `static someMethod() {`;

      const parsed = identifierParser.run(commentString);

      expect(parsed).toEqual({
        target: 'static someMethod() {',
        index: 17,
        result: {
          type: 'static member',
          name: 'someMethod',
        },
        isError: false,
        error: null,
      });
    });

    it('returns an error state if unable to parse string', () => {
      const commentString = `2 + 2 = 4`;

      const parsed = identifierParser.run(commentString);

      expect(parsed).toEqual({
        target: '2 + 2 = 4',
        index: 0,
        result: null,
        isError: true,
        error: `choice: unable to match with any parser at index 0`,
      });
    });
  });
});
