'use strict';

(()=>{
  const electron = require('electron');
  
  /**
   * ipcRenderer는 일렉트론의 이벤트 처리 & 메세지 전송을 담당한다고 생각하면 됨.
   * HELLO가 뜨면, 메세지 출력.
   * 로그인 성공하면, 메세지 출력 알림창 띄우기
   * 뭐 이런식으로 쭉쭉.
   */
  const ipcRenderer = electron.ipcRenderer;
  const SocketEvent = require('./handler_manager/event/SocketEvent');
  const DialogFactory=require('./webScripts/DialogFactory');
  const dialogFactory=new DialogFactory(document);
  ipcRenderer.on(SocketEvent.HELLO, (event, message)=>{
    console.log(message);
  });

  console.log(dialogFactory.getDialog('refreshTokenDialog').show());
})();