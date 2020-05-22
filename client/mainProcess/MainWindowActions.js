module.exports=(ipcMain,socket,TokenManager)=>{
  const emit=require('./MainWindowAction/emit');
  const getProfile=require('./MainWindowAction/getProfile');
  const MainEvent = require('./MainEvent');

  ipcMain.on(MainEvent.roomListSearch,(event,message)=>{
    emit(MainEvent.roomListSearch,socket,TokenManager,event,message);
  });
  ipcMain.on(MainEvent.createRoom,(event,message)=>{
    emit(MainEvent.createRoom,socket,TokenManager,event,message);
  });
  ipcMain.on(MainEvent.leaveRoom,(event,message)=>{
    emit(MainEvent.leaveRoom,socket,TokenManager,event,message);
  });
  ipcMain.on(MainEvent.joinRoomRequest,(event,message)=>{
    emit(MainEvent.joinRoomRequest,socket,TokenManager,event,message);
  });
  ipcMain.on(MainEvent.InviteUser,(event,message)=>{
    emit(MainEvent.InviteUser,socket,TokenManager,event,message);
  });
  ipcMain.on(MainEvent.searchUser,(event,message)=>{
    emit(MainEvent.searchUser,socket,TokenManager,event,message);
  });
  ipcMain.on(MainEvent.getProfile,(event,message)=>{
    getProfile(MainEvent.getProfile,TokenManager,event,message);
  });
};