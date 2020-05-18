'use strict';

//채팅방에서 메세지 와리가리를 이 핸들러로 처리함.

module.exports=(socket, win, TokenManager, message)=>{
  win.webContents.send('receiveMessage', message);
}