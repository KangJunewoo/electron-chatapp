module.exports = (result,message,ack)=>{
  message.result = result.taskResults;
  message.isSuccess=true;
  message.Error = undefined;
  ack(message);
  return Promise.resolve();
};