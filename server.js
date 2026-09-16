import express from 'express'
let app = global.app = express()

function connect(connOrPort, maybePort) {
	// Dipanggil sebagai connect(conn, PORT) dari main.js --server
	const PORT = typeof connOrPort === 'number' ? connOrPort : (maybePort || process.env.PORT || 3000)
	
	app.get('/', (req, res) => res.send('Hello World!'))
	
	app.get('/nowa', async (req, res) => {
		let q = req.query.number, regex = /x/g
		if (!q) return res.send('Input Parameter Number Parameter')
		if (!q.match(regex)) return res.send('Parameter Number Must Fill With One Letter "x"')
		let random = q.match(regex).length, total = Math.pow(10, random), array = []
		for (let i = 0; i < total; i++) {
			let list = [...i.toString().padStart(random, '0')]
			let result = q.replace(regex, () => list.shift()) + '@s.whatsapp.net'
			if (await conn.onWhatsApp(result).then(v => (v[0] || {}).exists)) {
				let info = await conn.fetchStatus(result).catch(_ => {})
				array.push({ jid: result, exists: true, ...info })
			} else {
				array.push({ jid: result, exists: false })
			}
		}
		res.json({ result: array })
	})
	
	app.listen(PORT, () => {
		console.log('App listened on port', PORT)
	})
}

function formatDate(n, locale = 'id') {
	let d = new Date(n)
	return d.toLocaleDateString(locale, { timeZone: 'Asia/Jakarta' })
}

export default connect
