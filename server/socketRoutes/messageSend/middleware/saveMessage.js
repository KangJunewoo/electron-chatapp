module.exports=(message,decodedUser)=>{
  const Message=require('../../../model/Message');
  const messageObject = new Message({
    sender:decodedUser._id,
    message:message.message,
    room:message.room
  });
  return messageObject.save();
}