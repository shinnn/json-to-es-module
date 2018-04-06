'use strict';

const {inspect} = require('util');

const inspectWithKind = require('inspect-with-kind');
const isObj = require('is-obj');
const parseJson = require('parse-json');

const prepended = 'export default ';
const inspectOptions = {
	breakLength: Infinity,
	compact: false,
	depth: null
};
function switchIndent(doubleSpaces) {
	return '\t'.repeat(doubleSpaces.length * 0.5);
}

module.exports = function jsonToEsModule(...args) {
	if (args.length !== 1 && args.length !== 2) {
		throw new TypeError(`Expected 1 or 2 arguments (str[, options]), but received ${
			args.length === 0 ? 'no' : args.length
		} arguments.`);
	}

	const [str, options] = args;

	if (typeof str !== 'string') {
		throw new TypeError(`Expected a JSON string, but got ${inspectWithKind(str)}.`);
	}

	if (str.length === 0) {
		throw new Error('Expected a JSON string, but got \'\' (empty string).');
	}

	if (str.trim().length === 0) {
		throw new Error(`Expected a JSON string, but got a whitespace-only string ${inspect(str)}.`);
	}

	if (args.length === 2) {
		if (!isObj(options)) {
			throw new TypeError(`Expected an options Object, but got ${inspectWithKind(args[1])}.`);
		}

		if ('filename' in options) {
			if (typeof options.filename !== 'string') {
				throw new TypeError(`Expected \`filename\` option to be a string, but got a non-string value ${
					inspectWithKind(options.filename)
				} instead.`);
			}
		}
	}

	return `${prepended}${inspect(
		parseJson(str, (options || {}).filename),
		inspectOptions
	).replace(/^( {2})+/gm, switchIndent)};\n`;
};
