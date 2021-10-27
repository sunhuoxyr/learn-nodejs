const prototBuff = require('protocol-buffers');
const fs = require('fs');
const schemas = prototBuff(fs.readFileSync(`${__dirname}/list.proto`));
const columnData = require('./mockdata/column');

const server = require('./lib/tool-server')(
  schemas.ListRequest,
  schemas.ListResponse
);

server
  .createServer((request, response) => {
    const { sortType = 1, filtType = 0 } = request.body;
    response.end({
      columns: columnData
        .sort((a, b) => {
          if (sortType == 1) {
            return a.id - b.id;
          } else if (sortType == 2) {
            return a.sub_count - b.sub_count;
          } else if (sortType == 3) {
            return a.column_price - b.column_price;
          }
        })
        .filter((item) => {
          if (filtType == 0) {
            return item;
          } else {
            return item.type == filtType;
          }
        }),
    });
  })
  .listen(4000, () => {
    console.log('rpc server listened: 4000');
  });
