const fs = require('fs/promises')
const path = require('path')

const BASE_DIR = path.join(__dirname, '..', 'data', 'configs')

async function ensureDir() {
	await fs.mkdir(BASE_DIR, { recursive: true })
}

function cfgPath(cfg) {
	return path.join(BASE_DIR, `${cfg}.json`)
}

async function saveConfig(cfg, data) {
	await ensureDir()
	const payload = {
		createdAt: new Date().toISOString(),
		...data,
	}
	await fs.writeFile(cfgPath(cfg), JSON.stringify(payload), 'utf8')
}

async function loadConfig(cfg) {
	await ensureDir()
	const raw = await fs.readFile(cfgPath(cfg), 'utf8')
	return JSON.parse(raw)
}

module.exports = {
	saveConfig,
	loadConfig,
}

