'use strict';

const jsonToEsModule = require('.');
const requireFromString = require('require-from-string');
const {rollup} = require('rollup');
const rollupPluginHypothetical = require('rollup-plugin-hypothetical');
const test = require('tape');

test('jsonToEsModule()', async t => {
	const result = jsonToEsModule('[\n  1,\n  "\'foo"\n  ]\n');

	t.equal(
		result,
		`export default [
	1,
	'\\'foo'
];
`,
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

	t.throws(
		() => jsonToEsModule('}', {}),
		/^JSONError.*Unexpected token \} in JSON at position 0 while parsing near '}'/,
		'should throw an error when it takes an invalid JSON.'
	);

	t.throws(
		() => jsonToEsModule('_', {filename: 'fixture.json'}),
		/^JSONError.*Unexpected token _ in JSON at position 0 while parsing near '_' in fixture\.json/,
		'should append filename to the error if provided.'
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
		() => jsonToEsModule('{}', {filename: /re/}),
		/^TypeError.*Expected `filename` option to be a string, but got a non-string value \/re\/ \(regexp\) instead\./,
		'should throw a type error when `filename` option is not a function.'
	);

	t.end();
});
