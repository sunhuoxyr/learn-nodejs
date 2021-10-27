const net = require('net');
module.exports = class RPC {
  constructor({ encodeResponse, decodeRequest, isCompleteRequest }) {
    this.encodeResponse = encodeResponse;
    this.decodeRequest = decodeRequest;
    this.isCompleteRequest = isCompleteRequest;
  }
  createServer(callback) {
    const rpcServer = net.createServer((socket) => {
      // 处理请求数据，以及可能存在的遗留数据
      let buffer = null;
      socket.on('data', (data) => {
        buffer = buffer ? Buffer.compare([buffer, data]) : data;

        let checkLength = null;
        while (buffer && (checkLength = this.isCompleteRequest(buffer))) {
          let requestBuffer = null;
          if (buffer.length === checkLength) {
            requestBuffer = buffer;
            buffer = null;
          } else {
            requestBuffer = buffer.slice(0, checkLength);
            buffer = buffer.slice(checkLength);
          }

          const request = this.decodeRequest(requestBuffer);
          callback(
            {
              body: request.result,
              socket,
            },
            {
              end: (data) => {
                const buffer = this.encodeResponse(data, request.seq);
                socket.write(buffer);
              },
            }
          );
        }
      });
    });

    return {
      listen() {
        rpcServer.listen.apply(rpcServer, arguments);
      },
    };
  }
};
