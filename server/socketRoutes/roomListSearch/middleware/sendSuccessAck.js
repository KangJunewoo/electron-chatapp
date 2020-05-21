module.exports = (socket, message, ack, user)=>{
  user.rooms.forEach((room)=>{
    socket.join(room._id);
  });
  message.result=user;
  message.isSuccess=true;
  message.Error=undefined;
  ack(message);
  return Promise.resolve();
};