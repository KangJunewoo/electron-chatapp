module.exports = (room,message,ack)=>{
  message.result = room.messages;
  message.isSuccess=true;
  message.Error = undefined;
  ack(message);
  return Promise.resolve();
};