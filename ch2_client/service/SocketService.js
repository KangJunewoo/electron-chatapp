'use strict';

/**
 * main.js에서 쓰일 사용자 정의 service들.
 * createSocket은 근데 거의 아무것도 안하는것같고
 * addHandlers는 event에 handler를 묶은걸 소켓에 묶는 역할을 하는듯.
 * 
 */

exports.createSocket=(io,socketURL,socketOptions)=>{
  return io(socketURL, socketOptions);
};

exports.addHandlers = (socket, win, handlerManager) => {
  let listeners=[];
  handlerManager.forEach((handler)=>{
    let callback=handler.handler.bind(null,socket,win)
    listeners.push(callback);
    socket.on(handler.event, callback);
  });
  return listeners;
};

exports.addHandler = (socket, win, handler) => {
  let listener=handler.handler.bind(null,socket,win);
  socket.on(handler.event, listener);
  return listener;
};

