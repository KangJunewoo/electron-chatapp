

// 소켓 관련 사용자 정의 서비스들. (서비스 == 리스너 인갑다.)
// handler로 listener를 설정해서 소켓에 연결하고 리턴하는 구조. 이따 다시 보자.

// 1. createSocket : 소켓을 생성한다.
exports.createSocket=(io,socketURL,socketOptions)=>{
  return io(socketURL, socketOptions);
};

// 2. addHandlers : 핸들러들을 추가한다 (핸들러는 handler_manager에서 정의해놓은 것들!)
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

// 3. addHandler : 핸들러를 추가한다.
exports.addHandler = (socket, win, handler) => {
  // bind는 함수를 외부로 끌어다 쓸 때 this를 설정해주는거라고 생각하면 될듯?
  let listener=handler.handler.bind(null,socket,win);
  socket.on(handler.event, listener);
  return listener;
};

// 4. addHandlerWithTokenManager : 핸들러를 토큰매니저와 함께 추가한다.
exports.addHandlerWithTokenManager = (socket, win, handler, TokenManager)=>{
  let listener=handler.handler.bind(null,socket,win, TokenManager);
  socket.on(handler.event, listener);
  return listener;
}