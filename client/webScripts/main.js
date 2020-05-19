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
  const RoomMenuArea = require('./webScripts/RoomMenuArea');
  const RoomArea=require('./webScripts/RoomArea');
  const dialogFactory=new DialogFactory(document);
  const roomMenuArea=  new RoomMenuArea(document);
  const roomArea=new RoomArea(document);
  ipcRenderer.on(SocketEvent.HELLO, (event, message)=>{
    console.log(message);
  });
  dialogFactory.getDialog('inviteRoomDialog').confirmButton.setEventListener(()=>{
    dialogFactory.getDialog('inviteRoomDialog').show();
  });
  dialogFactory.getDialog('inviteRoomDialog').cancelButton.setEventListener(()=>{
    dialogFactory.getDialog('inviteRoomDialog').show();
  });
  dialogFactory.getDialog('leaveRoomDialog').confirmButton.setEventListener(()=>{
    dialogFactory.getDialog('leaveRoomDialog').show();
  });
  dialogFactory.getDialog('leaveRoomDialog').cancelButton.setEventListener(()=>{
    dialogFactory.getDialog('leaveRoomDialog').show();
  });
  roomMenuArea.MenuList.setSelectListener(()=>{
    if(event.target.tagName==='DIV'){
      if(event.target.id==='inviteRoomButton'){
        dialogFactory.getDialog('inviteRoomDialog').show();
      }else{
        dialogFactory.getDialog('leaveRoomDialog').show();
      }
      
      dialogFactory.getDialog()
    }
  });
  roomArea.FriendMenuButton.setEventListener(()=>{
    dialogFactory.getDialog('friendMenuDialog').show();
  });
  roomArea.CreateRoomButton.setEventListener(()=>{
    dialogFactory.getDialog('createRoomDialog').show();
  });

  
})();