module.exports=(messageObject,io)=>{
  // TODO : https://socket.io/docs/emit-cheatsheet/
  io.in(messageObject.room).emit('broadcastMessage', messageObject);
  return Promise.resolve(messageObject);
}