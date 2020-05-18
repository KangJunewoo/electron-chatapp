'use strict';

/**
 * main.js에서 쓰일 사용자 정의 service들.
 * 
 * createSocket은 근데 거의 아무것도 안하는것같고
 * 
 * addHandlers는
 * handlerManager의 각 handler에 대해
 * 콜백함수를 정의하고
 * 소켓의 각 이벤트에 해당 콜백을 등록한 다음
 * 그 콜백모음인 listeners를 리턴하는듯.
 * 
 * addHandler는
 * 비슷한데 여러개 말고 한개만.
 */

exports.createSocket=(io,socketURL,socketOptions)=>{
  return io(socketURL, socketOptions);
};

exports.addHandlers = (socket, win, handlerManager) => {
  let listeners=[];
  handlerManager.forEach((handler)=>{
    // type 1 핸들러는 등록 ㄴㄴ
    if(handler.type === 1){
      return;
    }
    let callback=handler.handler.bind(null,socket,win);

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

exports.addHandlerWithTokenManager = (socket, win, handler, TokenManager)=>{
  let listener=handler.handler.bind(null,socket,win, TokenManager);
  socket.on(handler.event, listener);
  return listener;
}