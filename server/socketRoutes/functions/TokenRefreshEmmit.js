module.exports = (socket)=>{
  if(socket.isExistNewToken){
    socket.emit('tokenRefresh-Required');
  }
  return true;
};