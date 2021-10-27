const RpcServer = require('./rpc-server');

module.exports = function (protobufRequestSchema, protobufResponseSchema) {
  return new RpcServer({
    encodeResponse(buffer, seq) {
      const body = protobufResponseSchema.encode(buffer);
      const head = Buffer.alloc(8);
      head.writeUInt32BE(seq);
      head.writeUInt32BE(body.length, 4);
      return Buffer.concat([head, body]);
    },
    decodeRequest(buffer) {
      const seq = buffer.readUInt32BE();
      const result = protobufRequestSchema.decode(buffer.slice(8));
      return {
        seq,
        result,
      };
    },
    isCompleteRequest(buffer) {
      const bodyLength = buffer.readUInt32BE(4);
      return bodyLength + 8;
    },
  });
};
