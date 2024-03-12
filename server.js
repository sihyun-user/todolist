const http = require('http');
const { v4: uuid } = require('uuid');
const { successHandle, errorHandle } = require('./helpers');
const headers = require('./headers');
let todos = [];

const requestListen = (req, res) => {
  let body = '';
  req.on('data', (chunk) => {
    body+=chunk;
  });

  if (req.url == '/todos' && req.method == 'GET') {
    successHandle({ res, data: todos, message: '取得全部代辦成功' });
  } else if (req.url == '/todos' && req.method == 'POST') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        if (!title) return errorHandle(res, '欄位填寫錯誤');
        const todo = {
          title,
          id: uuid(),      
        }
        todos.push(todo);
        successHandle({ res, data: todo, message: '新增一筆代辦成功' });
      } catch (error) {
        errorHandle(res, error.message);
      }
    })
  } else if (req.url == '/todos' && req.method == 'DELETE') {
    todos.length = 0;
    successHandle({ res, data: todos, message: '刪除所有代辦成功' });
  } else if (req.url.startsWith('/todos/') && req.method == 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(todo => todo.id == id);
    if (index == -1) return errorHandle(res, '找不到該筆資料');

    todos.splice(index, 1);
    successHandle({ res, message: '刪除一筆代辦成功' });
  } else if (req.url.startsWith('/todos/') && req.method == 'PATCH') {
    req.on('end', () => {
      try {
        const { title } = JSON.parse(body);
        const id = req.url.split('/').pop();
        const index = todos.findIndex(todo => todo.id == id);
        if (index == -1) return errorHandle(res, '找不到該筆資料');
        if (!title) return errorHandle(res, '欄位填寫錯誤');

        todos[index].title = title;
        successHandle({ res, data: todos[index], message: '更新一筆代辦成功' });
      } catch (error) {
        errorHandle(res, error.message);
      }
    });
  } else if (req.method == 'OPTIONS') {
    successHandle({ res });
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      status: false,
      message: '找不到路由'
    }));
    res.end();
  }
};

const server = http.createServer(requestListen);
server.listen(process.env.PORT ||  3005);