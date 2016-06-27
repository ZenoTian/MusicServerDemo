
const express = require('express')
const path = require('path')
const router = module.exports = express.Router()
const Music = require('../models/music')
const formidable = require('formidable')
console.log('music路由被载入了')

router.prefix = '/music'


router.get('/list', (req, res) => {
	res.locals.title = '音乐列表'
	res.locals.list = Music.getList()//数据列表
	res.render('music/list')
})

router.get('/add', (req, res) => {
	res.locals.title = '添加音乐'
	res.render('music/add')
})

router.post('/add',(req, res) => {
	const form = new formidable.IncomingForm()
	//上传文件处理插件
	form.uploadDir = path.join(__dirname,'../www/uploads')
	form.keepExtensions  = true;
	//保存文件扩展名
	form.parse(req, (error, fields, files) => {
		if(error) throw error
			//接受到客户端提交过来文件的信息
		let id = 0
		Music.getList().forEach(m => {
			if (m.id > id) {
				id = m.id
			}
		})
		const music = new Music(id + 1, 
			files.title,
			files.artist,
			path.basename(files.music.path),
			path.basename(files.poster.path))
		music.save()
		res.render('music/list')
		//TODO 完善上传问题
	})
})

router.get('/edit/:id', (req, res) => {
	res.locals.title = '编辑音乐'
	const id = parseInt(req.params.id || 0)
	if (!id){
		res.staus(404).send('没有找到该音乐')
	}
	const temp = Music.getById(id)
	if (!temp) {
		return res.status(404).send('没有')
	}
	res.locals.item = temp
	res.render('music/edit')
})  

router.post('/edit/:id', (req, res) => {
	const id = parseInt(req.params.id || 0)
	if (!id){
		res.staus(404).send('没有找到该音乐')
	}
	const temp = Music.getById(id)
	if (!temp) {
		return res.status(404).send('没有')
	}
	temp.title = req.body.title
	temp.artist = req.body.artist
	if (!temp.update()) {
		res.locals.item = temp
		res.locals.title = '编辑音乐'
		res.render('music/edit')
	}
	//TODO数据库操作
	res.render('music/list')
})  

router.get('/delete/:id', (req, res) => {
	res.locals.title = '删除'
	//获得传来的id req.params.id
	const id = parseInt(req.params.id || 0)
	if (!id){
		res.staus(404).send('没有找到该音乐')
	}
	const temp = Music.getById(id)
	if (!temp) {
		return res.status(404).send('没有')
	}
	temp.delete();

	res.redirect('/music/list')
})