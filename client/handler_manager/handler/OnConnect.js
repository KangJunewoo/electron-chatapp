'use strict';

module.exports = (socket, win) => {
  const SocketEvent = require('../event/SocketEvent');
  console.log(`socket connected, socket id is ${socket.id}`);
  socket.emit(SocketEvent.HELLO, {message:'hello server!'});
  win.webContents.send(SocketEvent.HELLO, {message:'hello renderer process!'});

}