const headers = require('./headers');

function successHandle(obj){
  const { res, data, message } = obj;
  res.writeHead(200, headers);
  res.write(JSON.stringify({
    status: true,
    message,
    data,
  }));
  res.end();
}

function errorHandle(res, message){
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    status: false,
    message
  }));
  res.end();
}

module.exports = {
  successHandle,
  errorHandle
};