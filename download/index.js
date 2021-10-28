const koa = require('koa');
const fs = require('fs');
const static = require('koa-static');
const Router = require('koa-router');

const app = new koa();
const router = new Router();

app.use(static(__dirname + '/source'));

router.get('/', (ctx) => {
  ctx.body = fs.readFileSync(__dirname + '/source/index.html', 'utf-8');
});

app.use(router.routes());
app.listen(3000);
