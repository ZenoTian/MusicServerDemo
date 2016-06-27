const express = require('express')

const Music = require('../models/music')

const router = module.exports = express.Router()

router.prefix = '/api'

//api/music
router.get('/music', (req, res) => {
	const list = Music.getList()
	res.jsonp(list.map(item => {
		const temp = {}
		Object.assign(temp,item)
		temp.music = req.app.get('url') + '/uploads/' + temp.music
		temp.poster = req.app.get('url') + '/uploads/' + temp.poster
		return temp
	}))

})

router.get('/music/:id', (req, res) => {
	const id = parseInt(req.params.id || 0)
	if (!id) {
		return res.status(404).send('抱歉,请求数据失败')
	}
	const item = Music.getById(id)
	const temp = {}
		Object.assign(temp,item)
		temp.music = req.app.get('url') + '/uploads/' + temp.music
		temp.poster = req.app.get('url') + '/uploads/' + temp.poster
	res.jsonp(temp)
})
