const Router = require('router')
const cors = require('cors')
const qs = require('querystring')

const addonInterface = require('../addon')
const landingTemplate = require('./landingTemplate')
const { isEncodedConfig } = require('./configCodec')

const router = new Router()

router.use(cors())

router.get('/', (_, res) => {
	res.redirect(302, '/configure')
})

router.get('/configure', (_, res) => {
	res.setHeader('content-type', 'text/html; charset=utf-8')
	res.end(landingTemplate())
})

router.get('/:cfg/configure', (_, res) => {
	res.setHeader('content-type', 'text/html; charset=utf-8')
	res.end(landingTemplate())
})

router.get('{/:cfg}/manifest.json', async (req, res) => {
	try {
		const cfg = req.params.cfg || ''
		if (cfg && !isEncodedConfig(cfg)) throw new Error('cfg must be inline')
		res.setHeader('Content-Type', 'application/json; charset=utf-8')
		res.end(JSON.stringify(addonInterface.manifest))
	} catch {
		res.statusCode = 404
		res.setHeader('Content-Type', 'application/json; charset=utf-8')
		res.end(JSON.stringify({ error: 'Config não encontrada. Gere um link em /configure.' }))
	}
})

router.get('{/:cfg}/:resource/:type/:id{/:extra}.json', async (req, res, next) => {
	try {
		const { cfg = '', resource, type, id } = req.params

		if (cfg && !isEncodedConfig(cfg)) throw new Error('cfg must be inline')

		// mesmo truque do Brazuca: parsear extra do "último segmento" (skip=..&search=..)
		const extra =
			req.params.extra
				? qs.parse(req.url.split('/').pop().slice(0, -5))
				: {}

		const resp = await addonInterface.get(resource, type, id, { ...extra, __cfg: cfg })
		res.setHeader('Content-Type', 'application/json; charset=utf-8')
		res.end(JSON.stringify(resp))
	} catch (err) {
		if (err && err.noHandler) {
			if (next) next()
			else {
				res.statusCode = 404
				res.end(JSON.stringify({ err: 'not found' }))
			}
			return
		}
		console.error(err)
		res.statusCode = 500
		res.end(JSON.stringify({ err: 'handler error' }))
	}
})

module.exports = function serverless(req, res, next) {
	router(req, res, function () {
		if (next) next()
		else {
			res.statusCode = 404
			res.end()
		}
	})
}

