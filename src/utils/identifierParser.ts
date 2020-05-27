import {
  str,
  letters,
  digits,
  whitespace,
  sequenceOf,
  choice,
  many,
  between,
} from '../parsers';

/**
 * Parser for parsing all valid characters
 * in an identifier name
 */
const identifierName = many(
  choice([letters, digits, str('_'), str('-')])
).map((res) => res.join(''));

/**
 * Parser for parsing class declaration
 */
export const classDeclaration = sequenceOf([
  many(whitespace).discard(),
  str('class').discard(),
  many(whitespace).discard(),
  identifierName,
]).map((result) => ({
  type: 'class',
  name: result[0],
}));

/**
 * Parser for parsing variable declaration
 */
export const varDeclaration = sequenceOf([
  many(whitespace).discard(),
  choice([str('const'), str('let'), str('var')]).discard(),
  many(whitespace).discard(),
  identifierName,
]).map(([varName]) => ({
  type: 'variable',
  name: varName,
}));

/**
 * Parser for parsing function declaration
 */
export const functionDeclaration = sequenceOf([
  many(whitespace).discard(),
  str('function').discard(),
  many(whitespace).discard(),
  identifierName,
]).map(([fnName]) => ({
  type: 'function',
  name: fnName,
}));

/**
 * Parser for parsing static method declaration
 */
export const staticMemberDeclaration = sequenceOf([
  many(whitespace).discard(),
  str('static').discard(),
  many(whitespace).discard(),
  identifierName,
]).map(([memberName]) => ({
  type: 'static member',
  name: memberName,
}));

/**
 * Parser for parsing object method declaration
 */
export const methodDeclaration = sequenceOf([
  many(whitespace).discard(),
  identifierName,
  between(str('('), str(')'))(identifierName),
  many(whitespace).discard(),
]).map((result) => {
  if (result[0] === 'constructor') {
    return {
      type: 'constructor',
    };
  }
  return {
    type: 'method',
    name: result[0],
  };
});

/**
 * Parser for parsing getter/setter declaration
 */
export const getSetDeclaration = sequenceOf([
  many(whitespace).discard(),
  choice([str('get'), str('set')]),
  many(whitespace).discard(),
  identifierName,
]).map(([type, name]) => ({
  type: type === 'get' ? 'getter' : 'setter',
  name,
}));

/**
 * Parser for parsing at least one identifier declaration
 */
export const identifierParser = choice([
  classDeclaration,
  methodDeclaration,
  varDeclaration,
  functionDeclaration,
  staticMemberDeclaration,
  getSetDeclaration,
]);
