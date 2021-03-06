
const Koa = require('koa');
const Router = require('koa-router');
const next = require('next');
const session = require('koa-session');
const Redis = require('ioredis');

const auth = require('./server/auth');

const RedisSessionStore = require('./server/session-store')

const dev = process.env.NODE_ENV != 'production';
const app = next({ dev })
const handle = app.getRequestHandler();

//创建redis client 实例
const redis = new Redis();

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.keys = ['develop'];
  const SESSION_CONFIG = {
    key: 'jid',
    maxAge: 60 * 1000 * 30,
    store: new RedisSessionStore(redis),
  }

  server.use(session(SESSION_CONFIG, server));

  // 配置处理GitHub oauth 的登陆
  auth(server);

  // server.use(async (ctx, next) => {
  //   if (ctx.cookies.get('jid')) {
  //     ctx.session = {};
  //   }
  //   await next();
  // })


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


  // router
  server.use(router.routes());


  server.use(async (ctx, next) => {
    // cookies
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



  // server.use(async (ctx, next) => {
  // console.log(ctx.cookies.get('id'));

  // 获取用户数据
  // eg:
  // ctx.session = ctx.session || {};
  // ctx.session.user = {
  //   username: 'Jocky',
  //   age: 20
  // }

  // if (ctx.session.user) {
  //   ctx.session.user = {
  //     name: 'jocky',
  //     age: 16
  //   }
  // } else {
  //   console.log('session is : ' + ctx.session);
  // }
  //   console.log('session is : ' + JSON.stringify(ctx.session));
  //   // 不是最后一个中间件 需要next();
  //   await next();
  // })


  // router.get('/set/user', async (ctx) => {
  //   ctx.session.user = {
  //     name: 'jocky',
  //     age: 16
  //   }
  //   ctx.body = 'set session success';
  // })

  // router.get('/delete/user', async (ctx) => {
  //   // 清空session 调用 RedisSessionStore destroy
  //   ctx.session = null;
  //   ctx.body = 'delete session success';
  // })

