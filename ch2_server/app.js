'use strict';

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
//morgan은 console에 GET /뭐시기뭐시기 200 나타내주는 미들웨어.
const logger = require('morgan');
const io = require('socket.io')();
const headerPrinter = require('./headerPrinter');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
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

io.use((socket,next)=>{
  const token = socket.handshake.query.token;
  console.log(`token is ${token}`);
  if(token !== 'bye'){
    return next(new Error('Unauthorized'));
  }
  next();
});
io.on('connection', (socket)=>{
  socket.on('hello', (message)=>{
    console.log(message);
  });
  socket.on('disconnect',(err)=>{
    console.log(err);
  });
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
