module.exports=(socket,message,ack)=>{
  message.result=user.friendReceiveRequests;
  message.isSuccess=true;
  message.Error=undefined;
  ack(message);
  return Promise.resolve();
}