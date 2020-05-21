module.exports = (result,io)=>{
  const user = result.taskResults[0];
  const room = result.taskResults[1];
  io.to(user.socketId).emit('receiveInviteUser', {sender:result.sender,room:room});
  return Promise.resolve(result);
}