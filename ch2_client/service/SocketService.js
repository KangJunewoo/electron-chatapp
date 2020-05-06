'use strict';

exports.createSocket=(io,socketURL,socketOptions)=>{
  return io(socketURL, socketOptions);
};

exports.addHandlers = (socket, win, handlerManager) => {
  handlerManager.forEach((handler)=>{
    socket.on(handler.event,handler.handler.bind(null,socket,win));
  });
};