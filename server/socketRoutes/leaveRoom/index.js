module.exports=(socket, event)=>{
  const Verifier = require('../../util/Verifier');
  const JWTVerifier = new Verifier();
  const findRoom = require('./middleware/findRoom');
  const pullRoomToUser = require('./middleware/pullRoomToUser');
  const sendSuccessAck = require('./middleware/sendSuccessAck');
  const sendFailureAck = require('./middleware/sendFailureAck');

  socket.on(event, (message,ack)=>{
    JWTVerifier.verify(socket, message.token)
      .then((decodedUser)=>{
        return findRoom(decodedUser, message);
      })
      .then((user)=>{
        return pullRoomToUser(result);
      })
      .then((result)=>{
        return sendSuccessAck(result, message, ack);
      })
      .catch((error)=>{
        return sendFailureAck(error, message,ack);
      })
  })
}