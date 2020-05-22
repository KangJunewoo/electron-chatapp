module.exports=(socket, event)=>{
  const Verifier = require('../../util/Verifier');
  const JWTVerifier = new Verifier();
  const findFriends = require('./middleware/findFriends');
  const sendSuccessAck = require('./middleware/sendSuccessAck');
  const sendFailureAck = require('./middleware/sendFailureAck');

  socket.on(event, (message,ack)=>{
    JWTVerifier.verify(socket, message.token)
      .then((decodedUser)=>{
        return findFriends(decodedUser);
      })
      .then((result)=>{
        return sendSuccessAck(result, message, ack);
      })
      .catch((error)=>{
        return sendFailureAck(error, message,ack);
      })
  })
}