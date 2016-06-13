//执行分发

const app = require('./server/app')



const server = app.listen(process.env.PORT || 2080,'127.0.0.1', error => {
  if (error) throw error
  const address = server.address()
//获取端口
	app.set('url',`http://127.0.0.1:${ address.port }`)
  console.log(`server is ready @ 127.0.0.1:` + address.port)
})