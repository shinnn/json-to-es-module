# json-to-es-module

[![npm version](https://img.shields.io/npm/v/json-to-es-module.svg)](https://www.npmjs.com/package/json-to-es-module)
[![Build Status](https://travis-ci.com/shinnn/json-to-es-module.svg?branch=master)](https://travis-ci.com/shinnn/json-to-es-module)
[![codecov](https://codecov.io/gh/shinnn/json-to-es-module/branch/master/graph/badge.svg)](https://codecov.io/gh/shinnn/json-to-es-module)

Convert [JSON](https://tools.ietf.org/html/rfc8259) to an ECMAScript module

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

[Use](https://docs.npmjs.com/cli/install) [npm](https://docs.npmjs.com/about-npm/).

```
npm install json-to-es-module
```

## API

```javascript
const jsonToEsModule = require('json-to-es-module');
```

### jsonToEsModule(*str* [, *option*])

*str*: `string` (JSON string)  
*option*: `Object`  
Return: `string`

```javascript
jsonToEsModule(`{
  "foo": 1,
  "bar": [
    true,
    null
  ]
}`);
//=> 'export default {\n\tfoo: 1,\n\tbar: [\n\t\ttrue,\n\t\tnull\n\t]\n};\n'
```

#### option.filename

Type: `string`

Filename displayed in the error message.

```javascript
try {
  jsonToEsModule('"');
} catch (err) {
  err.message; //=> Unexpected end of JSON input while parsing near '"'
}

try {
  jsonToEsModule('"', {filename: 'source.json'});
} catch (err) {
  err.message; //=> Unexpected end of JSON input while parsing near '"' in source.json
}
```

## License

[ISC License](./LICENSE) © 2018 - 2019 Shinnosuke Watanabe
