const koa = require('koa');
const Router = require('koa-router');
const serveStatic = require('koa-static');
const getData = require('./getData');
const ReactDOMServer = require('react-dom/server');
const AppJsx = require('./app.jsx');
const template = require('./template')(__dirname + '/index.htm');

const app = new koa();
const router = new Router();

// 加载静态数据
app.use(serveStatic(__dirname + '/source'));

router.get('/data', async (ctx) => {
  const { sort = 0, filt = 0 } = ctx.query;

  ctx.body = await getData(+sort, +filt);
});

router.get('/', async (ctx) => {
  ctx.status = 200;
  const { sort = 0, filt = 0 } = ctx.query;
  const reactData = await getData(sort, filt);
  const reactString = ReactDOMServer.renderToString(AppJsx(reactData));
  ctx.body = template({
    reactString,
    reactData,
    filtType: filt,
    sortType: sort,
  });
});

app.use(router.routes());
app.listen(3000);
