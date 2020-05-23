

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
  const ChatArea=require('./webScripts/ChatArea');
  const MainEvent = require('./mainProcess/MainEvent');
  const dialogFactory=new DialogFactory(document);
  const roomMenuArea=  new RoomMenuArea(document);
  const roomArea=new RoomArea(document);
  const chatArea=new ChatArea(document);
  let locale = undefined;
  const successString='-Success';
  const failureString='-Failure';
  ipcRenderer.send(MainEvent.roomListSearch,{});
  ipcRenderer.send(MainEvent.getProfile,{});
  ipcRenderer.on(MainEvent.roomListSearch+successString,(event,message)=>{
    console.log(message.result);
    // FIXME : room이 비었기 때문에 foreach 작동 안됨.
    message.result.forEach((room)=>{
      roomArea.RoomList.addItem(room);
    });
  });
  ipcRenderer.on(MainEvent.roomListSearch+successString,(event,message)=>{
    alert('방리스트 조회 실패. ctrl + r로 새로고침해주세요');
  });
  roomArea.RoomList.setSelectListener((event)=>{
    const viewAnimation = ()=>{
      return new Promise((resolve, reject)=>{
        roomArea.RoomList.setCurrentItem(event.target)===true?resolve:reject;
      })
    };
    viewAnimation()
      .then(()=>{

      })
      .catch(()=>{
      });
  });
  ipcRenderer.on(MainEvent.tokenRefreshing, (event)=>{
    dialogFactory.getDialog('refreshTokenDialog').show();
  });
  ipcRenderer.on(MainEvent.tokenRefreshing+successString, (event)=>{
    dialogFactory.getDialog('refreshTokenDialog').show();
  });
  ipcRenderer.on(MainEvent.tokenRefreshing+failureString, (event)=>{
    dialogFactory.getDialog('refreshTokenDialog').show();
  });
  //FIXME : getProfile 기능이 왜 안먹을까?
  ipcRenderer.on(MainEvent.getProfile, (event, message)=>{
    console.log(message);
    roomArea.Profile.setName(message.name);
    locale=message.locale;
    chatArea.MessageList.ItemFactory.setLocale(locale);
    console.log(locale);
  });
  ipcRenderer.on(SocketEvent.HELLO, (event, message)=>{
    console.log(message);
  });
  dialogFactory.getDialog('inviteRoomDialog').confirmButton.setEventListener(()=>{
    const userId = dialogFactory.getDialog('inviteRoomDialog').getUserId();
    const targetRoom = roomArea.RoomList.getCurrentItem().id;
    ipcRenderer.send(MainEvent.InviteUser, {id:userId, roomId:targetRoom});
  });
  ipcRenderer.on(MainEvent.InviteUser+failureString, (event,message)=>{
    console.log(message);
    dialogFactory.getDialog('inviteRoomDialog').show();
    alert(`${message.result[0].id} 초대 성공`);
    
  })
  ipcRenderer.on(MainEvent.InviteUser+failureString, (event,message)=>{
    console.log(message);
    alert(`초대 실패`);
  })
  dialogFactory.getDialog('inviteRoomDialog').cancelButton.setEventListener(()=>{
    dialogFactory.getDialog('inviteRoomDialog').show();
  });
  dialogFactory.getDialog('leaveRoomDialog').confirmButton.setEventListener(()=>{
    const currentRoom = roomArea.RoomList.getCurrentItem();
    ipcRenderer.send(MainEvent.leaveRoom, {_id:currentRoom.id});
    
    chatArea.MessageList.clearItems();
    dialogFactory.getDialog('leaveRoomDialog').show();
  });
  ipcRenderer.on(MainEvent.leaveRoom+successString,(event,message)=>{
    console.log(message);
    const currentRoom = roomArea.RoomList.getCurrentItem();
    roomArea.RoomList.removeItem(currentRoom);
    roomArea.RoomList.clearCurrentItem();
    alert(message.result.room.roomName+'나가기 성공');
  });
  ipcRenderer.on(MainEvent.leaveRoom+successString,(event,message)=>{
    alert('나가기 실패');
  });
  dialogFactory.getDialog('leaveRoomDialog').cancelButton.setEventListener(()=>{
    dialogFactory.getDialog('leaveRoomDialog').show();
  });
  dialogFactory.getDialog('friendMenuDialog').CloseButton.setEventListener(()=>{
    dialogFactory.getDialog('friendMenuDialog').show();
  });
  dialogFactory.getDialog('addFriendDialog').confirmButton.setEventListener(()=>{
    dialogFactory.getDialog('addFriendDialog').show();
  })
  dialogFactory.getDialog('addFriendDialog').cancelButton.setEventListener(()=>{
    dialogFactory.getDialog('addFriendDialog').show();
  })
  dialogFactory.getDialog('listFriendDialog').CloseButton.setEventListener(()=>{
    dialogFactory.getDialog('listFriendDialog').show();
  })
  dialogFactory.getDialog('listFriendRequestDialog').CloseButton.setEventListener(()=>{
    dialogFactory.getDialog('listFriendRequestDialog').show();
  })
  dialogFactory.getDialog('friendMenuDialog').setSelectListener(()=>{
    if(event.target.tagName==='LI'){
      if(event.target.id==='addFriend'){
        dialogFactory.getDialog('friendMenuDialog').openDialog(dialogFactory.getDialog('addFriendDialog'), ipcRenderer);
      } else if(event.target.id==='showFriends'){
        dialogFactory.getDialog('friendMenuDialog').openDialog(dialogFactory.getDialog('listFriendDialog'), ipcRenderer);
      } else{
        dialogFactory.getDialog('friendMenuDialog').openDialog(dialogFactory.getDialog('listFriendRequestDialog'), ipcRenderer);
      }
    }
  });
  // FIXME : createroom 안됨
  dialogFactory.getDialog('createRoomDialog').confirmButton.setEventListener(()=>{
    ipcRenderer.send(MainEvent.createRoom,{roomName:dialogFactory.getDialog('createRoomDialog').getRoomName()});    
  });
  ipcRenderer.on(MainEvent.createRoom+successString,(event,message)=>{
    console.log(message);
    roomArea.RoomList.addItem(message.result.room)
      .then(roomArea.RoomList.setCurrentItem.bind(roomArea.RoomList))
      .then(chatArea.MessageList.clearItems.bind(chatArea.MessageList))
      .then(dialogFactory.getDialog('createRoomDialog').show.bind(dialogFactory.getDialog('createRoomDialog')))
      .catch((error)=>{
        console.log(error);
      });
  })
  dialogFactory.getDialog('createRoomDialog').cancelButton.setEventListener(()=>{
    dialogFactory.getDialog('createRoomDialog').show();
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
  chatArea.MessageInputview.setSendEventListener(()=>{
    alert(chatArea.MessageInputview.getMessage());
  });
  chatArea.MessageInputview.textArea.addEventListener('keydown', chatArea.MessageInputview.keyDownEventHandler.bind(chatArea.MessageInputview));
})();