/**
 * socketio 첫 튜토리얼
 * 원래는 const express= require('express');
 * const app = express();
 * 해줘야 하는데 아래처럼 통빱으로도 가능.
 * 
 * express 쓴다고 꼭 express-gernerator 써야하는거 아니다.
 * app.js만 만들고 필요한 패키지만 설정해줘도 무방.
 */
const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

// 80포트 즉 http 서버 사용하겠다.
server.listen(80);
// WARNING: app.listen(80) will NOT work here!

// 루트로 접속하면 index.html을 보내주겠다. 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

/**
 * 연결되면 콜백으로
  * 'news' 이벤트를 만들어 {hello:'world'}를 붙이고
  * 'my other event'가 일어나면
    * 해당 데이터를 서버 콘솔에 뿌린다.
 */
io.on('connection', (socket) => {
  socket.emit('news', { hello: 'world' });
  socket.on('my other event', (data) => {
    console.log(data);
  });
});