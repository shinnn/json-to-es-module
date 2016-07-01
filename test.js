'use strong';

const jsonToEsModule = require('.');
const noop = require('nop');
const requireFromString = require('require-from-string');
const {rollup} = require('rollup');
const rollupPluginHypothetical = require('rollup-plugin-hypothetical');
const test = require('tape');

test('jsonToEsModule()', t => {
  t.plan(16);

  t.strictEqual(jsonToEsModule.name, 'jsonToEsModule', 'should have a function name.');

  const result = jsonToEsModule('[\n  1,\n  "\'foo"\n  ]\n');
  t.strictEqual(
    result,
    'export default [\n  1,\n  \'\\\'foo\'\n]\n',
    'should append `module export` to JSON.'
  );

  rollup({
    entry: './tmp.js',
    plugins: [
      rollupPluginHypothetical({
        files: {
          './tmp.js': result
        }
      })
    ]
  }).then(bundle => {
    t.deepEqual(
      requireFromString(bundle.generate({format: 'cjs'}).code),
      [1, '\'foo'],
      'should create a valid ES module.'
    );
  });

  t.strictEqual(
    jsonToEsModule('"A"', {
      singleQuotes: false,
      filter: noop,
      inlineCharacterLimit: 0
    }),
    'export default "A"\n',
    'should support stringify-object options.'
  );

  t.strictEqual(
    jsonToEsModule('  \n\n{\n"a": "b"\n}\n   \n\n', {
      reviver(k, v) {
        if (k === '') {
          return v;
        }

        return `${v}c`;
      }
    }),
    'export default {\n  a: \'bc\'\n}\n',
    'should support JSON.parse\'s `reviver` option.'
  );

  t.throws(
    () => jsonToEsModule(),
    /^TypeError.*Expected 1 or 2 arguments \(str\[, options\]\), but received no arguments\./,
    'should throw a type error when it takes no arguments.'
  );

  t.throws(
    () => jsonToEsModule('1', {}, true),
    /^TypeError.*Expected 1 or 2 arguments \(str\[, options\]\), but received 3 arguments\./,
    'should throw a type error when it takes more than two arguments.'
  );

  t.throws(
    () => jsonToEsModule([Infinity, '000']),
    /^TypeError.*Expected a JSON string, but got \[ Infinity, '000' \]\./,
    'should throw a type error when the first argument is not a string.'
  );

  t.throws(
    () => jsonToEsModule('{}', NaN),
    /^TypeError.*Expected an object, but got NaN\./,
    'should throw a type error when the second argument is not an object.'
  );

  t.throws(
    () => jsonToEsModule('{}', {indent: 1}),
    /^TypeError.*`indent` option must be a string, but 1 isn't\. /,
    'should throw a type error when `indent` option is not a string.'
  );

  t.throws(
    () => jsonToEsModule('{}', {singleQuotes: Buffer.from('true')}),
    /^TypeError.*`singleQuotes` option must be a Boolean, but <Buffer 74 72 75 65> isn't\. /,
    'should throw a type error when `singleQuotes` option is not Boolean.'
  );

  t.throws(
    () => jsonToEsModule('{}', {filter: 0}),
    /^TypeError.* `filter` option must be a function, but 0 isn't\. /,
    'should throw a type error when `singleQuotes` option is not Boolean.'
  );

  t.throws(
    () => jsonToEsModule('{}', {inlineCharacterLimit: {x: 'y'}}),
    /^TypeError.*`inlineCharacterLimit` option must be a number, but { x: 'y' } isn't\. /,
    'should throw a type error when `inlineCharacterLimit` option is not a number.'
  );

  t.throws(
    () => jsonToEsModule('{}', {reviver: Math.PI}),
    /^TypeError.*3\.14\d+ is not a function\. `reviver` option must be a function /,
    'should throw a type error when `reviver` option is not a function.'
  );

  t.throws(
    () => jsonToEsModule('{}', {filename: /regex/}),
    /^TypeError.*\/regex\/ is not a string\. Expected a filename displayed in the error message\./,
    'should throw a type error when `filename` option is not a function.'
  );

  t.throws(
    () => jsonToEsModule('{', {filename: './fixture.json'}),
    /Unexpected end of input at 1:2 in \.\/fixture.json/,
    'should throw an error when it takes corrupt JSON.'
  );
});

