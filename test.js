'use strict';

const jsonToEsModule = require('.');
const noop = require('lodash/fp/noop');
const requireFromString = require('require-from-string');
const {rollup} = require('rollup');
const rollupPluginHypothetical = require('rollup-plugin-hypothetical');
const test = require('tape');

test('jsonToEsModule()', async t => {
	const result = jsonToEsModule('[\n  1,\n  "\'foo"\n  ]\n');

	t.equal(
		result,
		'export default [\n  1,\n  \'\\\'foo\'\n];\n',
		'should append `module export` to JSON.'
	);

	const bundle = await rollup({
		input: './tmp.mjs',
		plugins: [
			rollupPluginHypothetical({
				files: {
					'./tmp.mjs': result
				}
			})
		]
	});

	t.deepEqual(
		requireFromString((await bundle.generate({format: 'cjs'})).code),
		[1, '\'foo'],
		'should create a valid ES module.'
	);

	t.equal(
		jsonToEsModule('"A"', {
			singleQuotes: false,
			filter: noop,
			inlineCharacterLimit: 0
		}),
		'export default "A";\n',
		'should support stringify-object options.'
	);

	t.throws(
		() => jsonToEsModule(),
		/^TypeError.*Expected 1 or 2 arguments \(str\[, options]\), but received no arguments\./,
		'should throw a type error when it takes no arguments.'
	);

	t.throws(
		() => jsonToEsModule('1', {}, true),
		/^TypeError.*Expected 1 or 2 arguments \(str\[, options]\), but received 3 arguments\./,
		'should throw a type error when it takes more than two arguments.'
	);

	t.throws(
		() => jsonToEsModule([Infinity, '000']),
		/^TypeError.*Expected a JSON string, but got \[ Infinity, '000' ] \(array\)\./,
		'should throw a type error when the first argument is not a string.'
	);

	t.throws(
		() => jsonToEsModule(''),
		/^Error.*Expected a JSON string, but got '' \(empty string\)\./,
		'should throw a type error when the first argument is an empty string.'
	);

	t.throws(
		() => jsonToEsModule(' \n\t'),
		/^Error.*Expected a JSON string, but got a whitespace-only string ' \\n\\t'\./,
		'should throw a type error when the first argument is an whitespace-only string.'
	);

	t.throws(
		() => jsonToEsModule('{}', NaN),
		/^TypeError.*Expected an options Object, but got NaN \(number\)\./,
		'should throw a type error when the second argument is not an object.'
	);

	t.throws(
		() => jsonToEsModule('{}', {indent: 1}),
		/^TypeError.*`indent` option must be a string, but 1 \(number\) isn't\. /,
		'should throw a type error when `indent` option is not a string.'
	);

	t.throws(
		() => jsonToEsModule('{}', {singleQuotes: Buffer.from('true')}),
		/^TypeError.*`singleQuotes` option must be a Boolean, but <Buffer 74 72 75 65> isn't\. /,
		'should throw a type error when `singleQuotes` option is not Boolean.'
	);

	t.throws(
		() => jsonToEsModule('{}', {filter: 0}),
		/^TypeError.* `filter` option must be a function, but 0 \(number\) isn't\. /,
		'should throw a type error when `filter` option is not a function.'
	);

	t.throws(
		() => jsonToEsModule('{}', {inlineCharacterLimit: {x: 'y'}}),
		/^TypeError.*`inlineCharacterLimit` option must be a number, but { x: 'y' } \(object\) isn't\. /,
		'should throw a type error when `inlineCharacterLimit` option is not a number.'
	);

	t.throws(
		() => jsonToEsModule('{}', {filename: /re/}),
		/^TypeError.*\/re\/ \(regexp\) is not a string\. Expected a filename displayed in the error message\./,
		'should throw a type error when `filename` option is not a function.'
	);

	t.throws(
		() => jsonToEsModule('{', {filename: './fixture.json'}),
		/Unexpected end of JSON input while parsing near '{' in \.\/fixture\.json/,
		'should throw an error when it takes corrupt JSON.'
	);

	t.end();
});
