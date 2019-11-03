

async function test() {
  const Redis = require('ioredis');

  const redis = new Redis({
    port: '6379',
    host: '127.0.0.1',
    family: 4,
    password: '123456@1',
    db: 0,
  })

  await redis.set('a', '123456');
  const keys = await redis.keys('*');
  console.log(keys);
  console.log(await redis.get('a'))
}

test();