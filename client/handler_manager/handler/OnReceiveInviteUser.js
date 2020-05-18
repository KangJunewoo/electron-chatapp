'use strict';

module.exports = (socket, win, TokenManager, message)=>{
  win.webContents.send('receiveInviteUser', message);
};