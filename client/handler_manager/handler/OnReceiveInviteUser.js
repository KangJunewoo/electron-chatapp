

// 톡방초대받았을때인듯.
module.exports = (socket, win, TokenManager, message)=>{
  win.webContents.send('receiveInviteUser', message);
};