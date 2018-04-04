'use strict';

const {inspect} = require('util');

const inspectWithKind = require('inspect-with-kind');
const isObj = require('is-obj');
const parseJson = require('parse-json');
const stringifyObject = require('stringify-object');

const prepended = 'export default ';

module.exports = function jsonToEsModule(...args) {
	if (args.length !== 1 && args.length !== 2) {
		throw new TypeError(`Expected 1 or 2 arguments (str[, options]), but received ${
			args.length === 0 ? 'no' : args.length
		} arguments.`);
	}

	const [str] = args;

	if (typeof str !== 'string') {
		throw new TypeError(`Expected a JSON string, but got ${inspectWithKind(str)}.`);
	}

	if (str.length === 0) {
		throw new Error('Expected a JSON string, but got \'\' (empty string).');
	}

	if (str.trim().length === 0) {
		throw new Error(`Expected a JSON string, but got a whitespace-only string ${inspect(str)}.`);
	}

	if (args.length === 2 && !isObj(args[1])) {
		throw new TypeError(`Expected an options Object, but got ${inspectWithKind(args[1])}.`);
	}

	const options = Object.assign({indent: '  '}, args[1]);

	if (typeof options.indent !== 'string') {
		throw new TypeError(`\`indent\` option must be a string, but ${
			inspectWithKind(options.indent)
		} isn't. https://github.com/yeoman/stringify-object#indent`);
	}

	if ('singleQuotes' in options) {
		if (typeof options.singleQuotes !== 'boolean') {
			throw new TypeError(`\`singleQuotes\` option must be a Boolean, but ${
				inspectWithKind(options.singleQuotes)
			} isn't. https://github.com/yeoman/stringify-object#singlequotes`);
		}
	}

	if ('filter' in options) {
		if (typeof options.filter !== 'function') {
			throw new TypeError(`\`filter\` option must be a function, but ${
				inspectWithKind(options.filter)
			} isn't. https://github.com/yeoman/stringify-object#filterobj-prop`);
		}
	}

	if ('inlineCharacterLimit' in options) {
		if (typeof options.inlineCharacterLimit !== 'number') {
			throw new TypeError(`\`inlineCharacterLimit\` option must be a number, but ${
				inspectWithKind(options.inlineCharacterLimit)
			} isn't. https://github.com/yeoman/stringify-object#inlinecharacterlimit`);
		}
	}

	if ('filename' in options) {
		if (typeof options.filename !== 'string') {
			throw new TypeError(`${inspectWithKind(options.filename)
			} is not a string. Expected a filename displayed in the error message.`);
		}
	}

	return `${prepended +
         stringifyObject(parseJson(str, options.reviver, options.filename), options)
	};\n`;
};
