
const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');

const dev = process.env.NODE_ENV != 'production';
const app = next({ dev })
const handle = app.getRequestHandler();

// app.prepare().then(() => {
const server = new Koa();
const router = new Router();

// /test/123
router.get('/test/:id', (ctx) => {
  // ctx.body = `<span>hello test ${ctx.params}</span>`;
  ctx.body = { success: true };
  ctx.set('Content-Type', 'application/json');
})

server.use(async (ctx, next) => {
  await next()
})

server.use(router.routes());

// next 调用下一个中间件
// server.use(async (ctx, next) => {
//   const path = ctx.path;
//   ctx.body = `<span>koa render ${path}</span>`;
//   await next()
// })

// server.use(async (ctx, next) => {
//   await handle(ctx.req, ctx.res);
//   ctx.respond = false;
// })

server.listen(3000, () => {
  console.log('server listen success')
})
// })

