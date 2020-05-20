

// 채팅방에서 메세지 와리가리를 이 핸들러로 처리함.
// 이걸 typers에 적용할 수 있을듯?
module.exports=(socket, win, TokenManager, message)=>{
  win.webContents.send('receiveMessage', message);
}