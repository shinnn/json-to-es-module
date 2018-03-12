'use strict';

const {inspect} = require('util');

const isObj = require('is-obj');
const parseJson = require('parse-json');
const stringifyObject = require('stringify-object');

const prepended = 'export default ';

module.exports = function jsonToEsModule(...args) {
	if (args.length !== 1 || args.length !== 2) {
		throw new TypeError(`Expected 1 or 2 arguments (str[, options]), but received ${
			args.length === 0 ? 'no' : String(args.length)
		} arguments.`);
	}

	const [str] = args;

	if (typeof str !== 'string') {
		throw new TypeError(`Expected a JSON string, but got ${inspect(str)}.`);
	}

	if (args[1] !== undefined && !isObj(args[1])) {
		throw new TypeError(`Expected an object, but got ${inspect(args[1])}.`);
	}

	const options = Object.assign({indent: '  '}, args[1]);

	if (typeof options.indent !== 'string') {
		throw new TypeError(`\`indent\` option must be a string, but ${
			inspect(options.indent)
		} isn't. https://github.com/yeoman/stringify-object#indent`);
	}

	if ('singleQuotes' in options) {
		if (typeof options.singleQuotes !== 'boolean') {
			throw new TypeError(`\`singleQuotes\` option must be a Boolean, but ${
				inspect(options.singleQuotes)
			} isn't. https://github.com/yeoman/stringify-object#singlequotes`);
		}
	}

	if ('filter' in options) {
		if (typeof options.filter !== 'function') {
			throw new TypeError(`\`filter\` option must be a function, but ${
				inspect(options.filter)
			} isn't. https://github.com/yeoman/stringify-object#filterobj-prop`);
		}
	}

	if ('inlineCharacterLimit' in options) {
		if (typeof options.inlineCharacterLimit !== 'number') {
			throw new TypeError(`\`inlineCharacterLimit\` option must be a number, but ${
				inspect(options.inlineCharacterLimit)
			} isn't. https://github.com/yeoman/stringify-object#inlinecharacterlimit`);
		}
	}

	if ('reviver' in options) {
		if (typeof options.reviver !== 'function') {
			throw new TypeError(`${inspect(options.reviver)
			} is not a function. \`reviver\` option must be a function used by \`JSON.parse\`.` +
        ' https://tc39.github.io/ecma262/#sec-json.parse');
		}
	}

	if ('filename' in options) {
		if (typeof options.filename !== 'string') {
			throw new TypeError(`${inspect(options.filename)
			} is not a string. Expected a filename displayed in the error message.`);
		}
	}

	return `${prepended +
         stringifyObject(parseJson(str, options.reviver, options.filename), options)
	};\n`;
};
