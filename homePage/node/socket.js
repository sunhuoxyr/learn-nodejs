const fs = require('fs');
const protoBuff = require('protocol-buffers');
const EasySock = require('easy_sock');

const schemas = protoBuff(fs.readFileSync(`${__dirname}/list.proto`));

const easySock = new EasySock({
  ip: '127.0.0.1',
  port: 4000,
  timeout: 500,
  keepalive: true,
});

easySock.encode = (data, seq) => {
  const body = schemas.ListRequest.encode(data);
  const head = Buffer.alloc(8);
  head.writeUInt32BE(seq);
  head.writeUInt32BE(body.length, 4);
  return Buffer.concat([head, body]);
};

easySock.decode = (buffer) => {
  const seq = buffer.readInt32BE();
  const body = schemas.ListResponse.decode(buffer.slice(8));

  return {
    result: body,
    seq,
  };
};

easySock.isReceiveComplete = (buffer) => {
  if (buffer.length < 8) {
    return;
  }
  const bodyLength = buffer.readInt32BE(4);
  if (buffer.length >= bodyLength + 8) {
    return bodyLength + 8;
  } else {
    return 0;
  }
};

module.exports = easySock;
