const koa = require("koa")
const router = require("koa-router")()
const bodyParser = require("koa-bodyparser")
const xmlParser = require("koa-xml-body")

const http = require("http")

const { port } = require('./yuque/config')
const { writeMd, unpack } = require('./yuque/vendor')

const app = new koa()
app.use(xmlParser())
app.use(bodyParser())

// router.get('/', async (ctx, next) => {
//   console.log(ctx.request.query)
//   ctx.response.body = ctx.request.query
//   return
// })

router.post('/', async (ctx, next) => {
  const { data } = ctx.request.body
  writeMd(data.title, data.body, data.book.name || '')
  console.log(`>>> start write to ${data.title}`)
  unpack()
  ctx.response.body = 'success'
  ctx.status = 200
  return
})

app.use(router.routes())

app.use(async (ctx, next) => {
  ctx.status = 404
})

http.createServer(app.callback()).listen(port)

console.log("Yuque started at port " + port)
