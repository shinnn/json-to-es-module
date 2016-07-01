# json-to-es-module

[![NPM version](https://img.shields.io/npm/v/json-to-es-module.svg)](https://www.npmjs.com/package/json-to-es-module)
[![Build Status](https://travis-ci.org/shinnn/json-to-es-module.svg?branch=master)](https://travis-ci.org/shinnn/json-to-es-module)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/json-to-es-module.svg)](https://coveralls.io/r/shinnn/json-to-es-module)
[![dependency Status](https://david-dm.org/shinnn/json-to-es-module.svg)](https://david-dm.org/shinnn/json-to-es-module)
[![devDependency Status](https://david-dm.org/shinnn/json-to-es-module/dev-status.svg)](https://david-dm.org/shinnn/json-to-es-module#info=devDependencies)

Convert [JSON](https://www.ietf.org/rfc/rfc4627.txt) to an ECMAScript module

```json
{
  "name": "Michael"
}
```

↓

```javascript
export default {
  name: 'Michael'
}
```

## Installation

[Use npm.](https://docs.npmjs.com/cli/install)

```
npm install json-to-es-module
```

## API

```javascript
const jsonToEsModule = require('json-to-es-module');
```

### jsonToEsModule(*str* [, *options*])

*str*: `String` (JSON string)  
*options*: `Object`  
Return: `String`

#### options

[`reviver`](https://github.com/sindresorhus/parse-json#reviver) and [`filename`](https://github.com/sindresorhus/parse-json#filename) will be passed to [parse-json](https://github.com/sindresorhus/parse-json#parsejsoninput-reviver-filename) while JSON parsing.

```javascript
jsonToEsModule('[1]', {
  reviver(k, v) {
    if (k === '') {
      return v;
    }

    return v * 10;
  }
}); //=> 'export default [\n  10\n]\n'
```

Also [`indent`](https://github.com/yeoman/stringify-object#indent), [`singleQuotes`](https://github.com/yeoman/stringify-object#singlequotes), [`filter`](https://github.com/yeoman/stringify-object#filterobj-prop) and [`inlineCharacterLimit`](https://github.com/yeoman/stringify-object#inlinecharacterlimit) will passed to [stringify-object](https://github.com/yeoman/stringify-object#stringifyobjectinput-options) while stringification.

```javascript
jsonToEsModule('{"a": "b"}', {singleQuotes: true}); //=> 'export default {\n  a: \'b\'\n}\n'
jsonToEsModule('{"a": "b"}', {singleQuotes: false}); //=> 'export default {\n  a: "b"\n}\n'
```

## License

Copyright (c) 2016 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).
