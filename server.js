const http = require('http');
const { v4: uuidv4 } = require('uuid');
// uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'
const errorHeadle = require('./errorHeadle');

const todos = [];

const requestListenner = (req, res) =>{
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  };
  // console.log(req.url);
  // console.log(req.method);
  let body = "";
  let num = 0;
  // 抓資料
  req.on('data', chunk=>{
    body += chunk;
  });
  // 接收資料
  // req.on('end', ()=>{
  //   console.log(JSON.parse(body).title);
  // });
  if(req.url == "/todos" && req.method == "GET"){ //首頁
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      "status": "success",
      "data": todos,
    }));
    res.end();
  }else if (req.url == "/todos" && req.method == "POST"){ //新增
    req.on('end', ()=>{
      try
      {
        let title = JSON.parse(body).title;
        if(title !== null && title !== undefined ){

          let todo = {
            "title": title,
            'id': uuidv4()
          };
    
          todos.push(todo);
    
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }));
          res.end();

        }else{
          errorHeadle(res, 400, "格式錯誤");
        }
      }
      catch(error)
      {
        errorHeadle(res, 400, "格式錯誤");
      }
    
    });
  }else if (req.url.startsWith("/todos/") && req.method == "POST"){ //修改
    req.on('end', ()=>{
      try
      {
        let id = req.url.split('/').pop();
        let index = todos.findIndex(item => item.id == id);
        let title = JSON.parse(body).title;
        if(title !== null && title !== undefined && index != -1){
          todos[index].title = title;
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            "status": "success",
            "data": todos,
          }));
          res.end();

        }else{
          errorHeadle(res, 400, "格式錯誤");
        }
      }
      catch(error)
      {
        errorHeadle(res, 400, "格式錯誤");
      }
    
    });
  }else if (req.url == "/todos" && req.method == "DELETE"){ //刪除全部 
    req.on('end', ()=>{
      res.writeHead(200, headers);
      todos.length = 0;
      res.write(JSON.stringify({
        "status": "success",
        "data": todos,
      }));
      res.end();
    });
  }else if (req.url.startsWith("/todos/") && req.method == "DELETE"){ //刪除全部 && 刪除單筆
    let id = req.url.split('/').pop();
    let index = todos.findIndex(item => item.id == id);
    if(index != -1){
      todos.splice(index, 1);

      res.writeHead(200, headers);
      res.write(JSON.stringify({
        "status": "success",
        "data": todos,
      }));
      res.end();
    }else{
      errorHeadle(res, 400, "沒有這筆資料");
    }
  }else if (req.method == "OPTIONS"){ //
    res.writeHead(200, headers);
    res.end();
  }else{ // 404
    errorHeadle(res, 404, "無此網路");
  }
}

const server = http.createServer(requestListenner);
server.listen(3005);