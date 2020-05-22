module.exports = (user,message,ack)=>{
  message.result = user;
  message.isSuccess=true;
  message.Error = undefined;
  ack(message);
  return Promise.resolve();
};