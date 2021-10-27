const socket = require('./socket');

module.exports = async function (sortType = 0, filtType = 0) {
  const data = await new Promise((resolve, reject) => {
    socket.write(
      {
        sortType,
        filtType,
      },
      function (err, res) {
        return err ? reject(err) : resolve(res.columns);
      }
    );
  });
  return data;
};
