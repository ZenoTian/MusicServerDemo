const express = require('express')

const Music = require('../models/music')

const router = module.exports = express.Router()

router.prefix = '/api'

//api/music
router.get('/music', (req, res) => {
	// res.send(Music.getList())
	// res.send(`${req.query.cb} && ${req.query.cb}(${JSON.stringify(Music.getList())})`)
	//自己写的需要设置响应的响应类型
	//Content Type  = text/javascript
	// res.jsonp(Music.getList())
	//jsonp方法会自动接收客户端传来的回调的名称
	//默认接收键为callback 可以自定义接收的回调的函数名
	//使用app.set('jsonp callback name','cb')
	//获得数据后的注释（分号），为了防止出现异常
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
