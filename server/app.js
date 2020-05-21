

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
//morgan은 console에 GET /뭐시기뭐시기 200 나타내주는 미들웨어.
const logger = require('morgan');
// () 달아줘서 즉시실행.
const io = require('socket.io')();
const headerPrinter = require('./headerPrinter');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const mongoose = require("mongoose");
const Initializer = require('./init/initializer');
const User = require('./model/User');
const jsonwebtoken = require('jsonwebtoken');
const SocketRoutes = require('./socketRoutes');
const app = express();
Initializer.InitMongoDB(process.env, mongoose);
// express 앱에 io를 쓰겠다.
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// 여러 셋업들..
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// 드디어 사용자가 정의한 부분들 사용!
app.use('/', indexRouter);
app.use(headerPrinter);
app.use('/users', usersRouter);

// 여기까지 왔다면 100% 404에러다.
// 여기부턴 에러를 만들어서라도 보낸다.
app.use(function(req, res, next) {
  next(createError(404));
});

/**
 * io.use로 미들웨어를 다는 코드.
 * 토큰 출력하고
 * 만약 토큰이 bye가 아니면 에러출력.
 * bye이면 무사히 다음 단계로 ㄱㄱ.
 * io는 왜 createError 다음에 올까..
 */

// handshake middleware
io.use(SocketRoutes.handshake);

/**
 * io가 연결되면
 * hello 이벤트에 msg 출력하고
 * 연결끊어지면 에러 출력한다.
 */
io.on('connection', (socket)=>{
  SocketRoutes.functions.TokenRefreshEmmit(socket);
  SocketRoutes.functions.SetSocketId(socket).then((user)=>{
    SocketRoutes.functions.JoinRooms(user,socket);
  });
  SocketRoutes.createRoom(socket, SocketRoutes.event.createRoom);
  SocketRoutes.hello(socket, SocketRoutes.event.hello);
  SocketRoutes.disconnect(socket, SocketRoutes.event.disconnect);
});


// error handler : 넘어온 에러를 화면에 띄워주자~
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // 에러핸들링 + 에러페이지 렌더
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
