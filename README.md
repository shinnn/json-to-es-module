# json-to-es-module

[![npm version](https://img.shields.io/npm/v/json-to-es-module.svg)](https://www.npmjs.com/package/json-to-es-module)
[![Build Status](https://travis-ci.org/shinnn/json-to-es-module.svg?branch=master)](https://travis-ci.org/shinnn/json-to-es-module)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/json-to-es-module.svg)](https://coveralls.io/r/shinnn/json-to-es-module)

Convert [JSON](https://www.ietf.org/rfc/rfc4627.txt) to an ECMAScript module

```json
{
  "name": "Sam"
}
```

↓

```javascript
export default {
  name: 'Sam'
};
```

## Installation

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/getting-started/what-is-npm).

```
npm install json-to-es-module
```

## API

```javascript
const jsonToEsModule = require('json-to-es-module');
```

### jsonToEsModule(*str* [, *options*])

*str*: `string` (JSON string)  
*options*: `Object`  
Return: `string`

#### options

[`filename`](https://github.com/sindresorhus/parse-json#filename) will be passed to [parse-json](https://github.com/sindresorhus/parse-json#parsejsoninput-reviver-filename) while JSON parsing, and [`indent`](https://github.com/yeoman/stringify-object#indent), [`singleQuotes`](https://github.com/yeoman/stringify-object#singlequotes), [`filter`](https://github.com/yeoman/stringify-object#filterobj-prop) and [`inlineCharacterLimit`](https://github.com/yeoman/stringify-object#inlinecharacterlimit) will passed to [stringify-object](https://github.com/yeoman/stringify-object#stringifyobjectinput-options) while stringification.

```javascript
jsonToEsModule('{"a": "b"}', {singleQuotes: true}); //=> 'export default {\n  a: \'b\'\n};\n'
jsonToEsModule('{"a": "b"}', {singleQuotes: false}); //=> 'export default {\n  a: "b"\n};\n'
```

## License

[ISC License](./LICENSE) © 2018 Shinnosuke Watanabe
