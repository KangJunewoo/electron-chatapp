module.exports = (error,message,ack)=>{
  console.log(error);
  message.result=[];
  message.isSuccess=false;
  message.Error=error;
  ack(message);
  return Promise.resolve();
}