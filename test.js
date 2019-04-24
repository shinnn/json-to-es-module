'use strict';

const {SourceTextModule} = require('vm');

const jsonToEsModule = require('.');
const noop = require('lodash/noop');
const test = require('tape');

test('jsonToEsModule()', async t => {
	const result = jsonToEsModule('[\n  -0,\n  "\'foo"\n]\n');

	t.equal(
		result,
		`export default [
	-0,
	"'foo"
];
`,
		'should append `module export` to JSON.'
	);

	const createdModule = new SourceTextModule(result);

	await createdModule.link(noop);
	createdModule.instantiate();
	await createdModule.evaluate();

	t.deepEqual(
		createdModule.namespace.default,
		[-0, '\'foo'],
		'should create a valid ES module.'
	);

	t.equal(
		jsonToEsModule('"\\"\'"'),
		'export default `"\'`;\n',
		'should support top-level primitive value.'
	);

	t.throws(
		() => jsonToEsModule('}', {}),
		/^JSONError.*Unexpected token \} in JSON at position 0 while parsing near '\}'/u,
		'should throw an error when it takes an invalid JSON.'
	);

	t.throws(
		() => jsonToEsModule('_', {filename: 'fixture.json'}),
		/^JSONError.*Unexpected token _ in JSON at position 0 while parsing near '_' in fixture\.json/u,
		'should append filename to the error if provided.'
	);

	t.throws(
		() => jsonToEsModule(),
		/^TypeError.*Expected 1 or 2 arguments \(json: <string>\[, options: <Objects>\]\), but received no arguments\./u,
		'should throw a type error when it takes no arguments.'
	);

	t.throws(
		() => jsonToEsModule('1', {}, true),
		/^TypeError.*Expected 1 or 2 arguments \(json: <string>\[, options: <Objects>\]\), but received 3 arguments\./u,
		'should throw a type error when it takes more than two arguments.'
	);

	t.throws(
		() => jsonToEsModule([Infinity, '000']),
		/^TypeError.*Expected a JSON string, but got \[ Infinity, '000' \] \(array\)\./u,
		'should throw a type error when the first argument is not a string.'
	);

	t.throws(
		() => jsonToEsModule(''),
		/^Error.*Expected a JSON string, but got '' \(empty string\)\./u,
		'should throw a type error when the first argument is an empty string.'
	);

	t.throws(
		() => jsonToEsModule(' \n\t'),
		/^Error.*Expected a JSON string, but got a whitespace-only string ' \\n\\t'\./u,
		'should throw a type error when the first argument is an whitespace-only string.'
	);

	t.throws(
		() => jsonToEsModule('{}', NaN),
		/^TypeError.*Expected an options Object, but got NaN \(number\)\./u,
		'should throw a type error when the second argument is not an object.'
	);

	t.throws(
		() => jsonToEsModule('{}', {filename: /re/u}),
		/^TypeError.*Expected `filename` option to be a string, but got a non-string value \/re\/u \(regexp\) instead\./u,
		'should throw a type error when `filename` option is not a function.'
	);

	t.end();
});
