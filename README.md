# inline-comment-parser

Parse inline comments in array of files.

## Installation

Install with npm

```
npm install inline-comment-parser
```

## Usage

```js
const { parseFiles } = require('inline-comment-parser');

const pattern = 'path/to/your/files/*.*';

const parsed = parseFiles(pattern, '///');
```

This will get all files matching the glob pattern and parse all comments inside of them that start with the passed in delimiter.

## API

This package exposes two functions:

- `parseFiles`
- `parseComment`

### `parseFiles`

Takes a glob pattern and a comment delimiter.

Parses all files matching pattern and all comments inside of each file.

A comment is any string beginning with the specified delimiter. If a delimiter is not passed in, the default `///` will be used.

Comments found on consecutive lines will be concatenated.

If a comment is followed by identifier declarations of the following form, that information will be added to the returned object:

```
class declaration --> 'class SomeClass {'
// { type: 'class', name: 'SomeClass' }

variable declaration -->  'const one = 'two''
// { type: 'variable', name: 'one' }

function declaration -->  'function someFunc() {'
// { type: 'function', name: 'someFunc' }

static member declaration -->  'static someMethod() {'
// { type: 'static member', name: 'someMethod' }

method declaration -->  'someMethod() {'
// { type: 'method', name: 'someMethod' }

constructor -->  'constructor(someArg) {'
// { type: 'constructor' }

getter -->  'get prop() {'
// { type: 'getter', name: 'prop' }

setter -->  'set someOtherProp {'
// { type: 'setter', name: 'prop' }

```

#### Example

```js
// src/utils/someFile.js

/// Need to come back to this       <-- // Line 2, for instance
/// function in the future          
const square = (num) => num * num 


// script.js
const { parseFiles } = require('inline-comment-parser');

const pattern = 'path/to/src/utils/*.js';

const parsed = parseFiles(pattern, '///');
//  {
//    content: 'Need to come back to this function in the future',
//    source: {
//      type: 'variable',
//      name: 'square',
//      lineNumber: 2,
//    },
//  },
```

### `parseComment`

Similar to `parseFiles` but takes in a single string instead of a file array.

#### Example

```js
const { parseComment } = require('inline-comment-parser');

const commentString = `
// TODO: Refactor this class
// TODO: to parse more widgets.
class TestClass
`;

parseComment(commentString, '// TODO:');
//  {
//    content: 'Refactor this class to parse more widgets.',
//    source: {
//      type: 'class',
//      name: 'TestClass',
//      lineNumber: 2,
//    },
//  },
```