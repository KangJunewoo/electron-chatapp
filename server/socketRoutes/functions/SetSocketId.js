module.exports = (socket)=>{
  const User = require('../../model/User');
  const update = {
    $set:{
      socketId:socket.id
    }
  };
  const options = {
    new:true,
  };
  return User.findOneAndUpdate({id:socket.handshake.query.id}, update, options).populate('rooms');
}