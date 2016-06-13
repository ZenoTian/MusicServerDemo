//业务入口

const path = require('path')
const glob = require('glob')
const express = require('express')
const bodyParser = require('body-parser')

const app = module.exports = express()

//配置模板引擎 body-parser controller载入
app.set('views',path.join(__dirname,'views'))
app.set('view engine','xtpl')

console.log('app模块已载入');

//静态文件处理
app.use(express.static(path.join(__dirname,'www')))

//配置bodyparser解析路径
app.use(bodyParser.urlencoded({ extended:false }))

const controllers = glob.sync('./controllers/**/*.js',{ cwd: __dirname })
controllers.forEach(c => {
  const controller = require(c)
	//动态加载控制器
  controller.prefix && typeof controller == 'function' 
  && app.use(controller.prefix,controller)
})	

if (!module.parent) {
	//module.parent 加载当前模块的父模块 相当于index
	//module.parent 只有当前文件被载入的清苦啊下才有值，否则为Null
  const server = app.listen(process.env.PORT || 2080, error => {
  if (error) throw error
  const address = server.address()
  console.log(`server is ready @ 127.0.0.1` + address.port)
 })
}