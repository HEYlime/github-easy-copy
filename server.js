
const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const session = require('koa-session');
const Redis = require('ioredis');
const koaBody = require('koa-body');
const atob = require('atob');

const auth = require('./server/auth');
const api = require('./server/api');

const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV != 'production';
const app = next({ dev })
const handle = app.getRequestHandler();

//创建redis client 实例
const redis = new Redis();

// 设置 nodejs 全局增加一个atob方法
global.atob = atob;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.keys = ['develop'];
  const SESSION_CONFIG = {
    key: 'jid',
    maxAge: 60 * 1000 * 60,
    store: new RedisSessionStore(redis),
  }

  server.use(koaBody());
  server.use(session(SESSION_CONFIG, server));

  // 配置处理GitHub oauth 的登陆
  auth(server);
  api(server);

  router.get('/a/:id', async (ctx) => {
    const id = ctx.params.id;
    await handle(ctx.req, ctx.res, {
      pathname: '/a',
      query: { id }
    })
    ctx.respond = false;
  })


  router.get('/api/user/info', async (ctx) => {
    const user = ctx.session.userInfo;
    if (!user) {
      ctx.status = 401;
      ctx.body = 'NEED LOGIN';
    } else {
      ctx.body = ctx.session.userInfo;
      ctx.set('Content-Type', 'application/json');
    }

  })

  server.use(router.routes());


  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session;
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  })

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  })

  server.listen(3000, () => {
    console.error('server listen success 3000');
  })
})


