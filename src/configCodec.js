const LZString = require('lz-string')

const PREFIX = 'c_'

function encodeConfig(obj) {
	const json = JSON.stringify(obj)
	const encoded = LZString.compressToEncodedURIComponent(json)
	return `${PREFIX}${encoded}`
}

function isEncodedConfig(s) {
	return typeof s === 'string' && s.startsWith(PREFIX)
}

function decodeConfig(s) {
	if (!isEncodedConfig(s)) throw new Error('not encoded config')
	const encoded = s.slice(PREFIX.length)
	const json = LZString.decompressFromEncodedURIComponent(encoded)
	if (!json) throw new Error('invalid encoded config')
	return JSON.parse(json)
}

module.exports = {
	encodeConfig,
	decodeConfig,
	isEncodedConfig,
	PREFIX,
}

